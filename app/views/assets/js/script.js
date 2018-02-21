import signUp from './modules/signUp.js';
import addnew from './modules/addnew.js';
import navbar from './modules/navbar.js';
import historyTable from './modules/history.js';
import ranking from './modules/ranking.js';
import { fail, success } from './modules/alerts.js';

// HTML loaded
$(() => {

  // set global variables
  let addInterAdd;
  let addInterHistory;
  const timeToReload = 900;
  const adminLog = JSON.parse(localStorage.getItem('adminLoged'));
  const $pageContent = $('<div class="page-content"></div>');

  // lazy mode
  function fillForm() {
    $('#inputUsername').val('nacho');
    $('#inputPassword').val('qwerty');
  }

  // reload the historo of late students
  function reloadHistory() {
    clearInterval(addInterHistory);
    $('.alert').fadeOut('slow');
    $.ajax('/history', {
        method: 'GET',
        contentType: 'application/json',
      })
      .done((data) => {
        if (!data.error) {
          $pageContent.empty().append(historyTable(data));
        } else {
          $pageContent.append(fail(data));
        }
      })
      .fail((data) => {
        $pageContent.append(fail(data.status));
      });
  }

  // if we are loged will appear
  function buildApp() {
    const date = new Date();
    let hh = date.getHours();
    let mm = date.getMinutes();
    let month = date.getMonth() + 1;
    hh = hh < 10 ? '0' + hh : hh;
    mm = mm < 10 ? '0' + mm : mm;
    month = month < 10 ? '0' + month : month;
    const day = `${date.getDate()}.${month}.${date.getFullYear()}`;
    const hour = `${hh}:${mm}`;
    $('.alert').fadeOut('slow');
    clearInterval(addInterAdd);
    clearInterval(addInterHistory);
    $('body').empty().append(navbar).append($pageContent);
    $pageContent.empty().append(addnew(day, hour)).css(('margin-top'), $('.navbar').outerHeight());
  }

  // if we are not loged will appear
  function buildLogin() {
    clearInterval(addInterAdd);
    clearInterval(addInterHistory);
    $('body').empty().append($pageContent);
    $pageContent.empty().append(signUp).css(('margin-top'), $('.navbar').outerHeight());
  }

  // check localStorage
  if (adminLog) {
    buildApp();
  } else {
    buildLogin();
    fillForm();
  }

  // click events in body, checkig ID and DataID
  $('body').click((event) => {
    event.preventDefault();
    const { target } = event;
    const clickId = target.getAttribute('id');
    const dataId = target.getAttribute('data-id');
    if (clickId === 'loginButton') {
      const user = $('#inputUsername').val();
      const password = $('#inputPassword').val();

      // async & await
      async function userLogin() {
        try {
          const login = await $.ajax('/login', {
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
              username: user,
              password: password,
            }),
          })

          const auth = await $.ajax('/content', {
              method: 'GET',
              contentType: 'application/json',
            })
            .done((data) => {
              if (!data.error) {
                buildApp();
                localStorage.setItem('adminLoged', JSON.stringify(data));
              }
            })
        } catch (err) {
          $('.alert-danger').remove();
          $('.text-muted').prepend(fail(err.responseText));
        }
      }
      userLogin();

      /*
            // promises way to make ajax
            let userAuth = () => {
              $.ajax('/content', {
                  method: 'GET',
                  contentType: 'application/json',
                })
                .done((data) => {
                  if (!data.error) {
                    buildApp();
                    localStorage.setItem('adminLoged', JSON.stringify(data));
                  } else {
                    fail(data);
                  }
                })
                .fail((data) => {
                  if (data.status === 401) {
                    $('.alert-danger').remove();
                    $('.text-muted').prepend(fail('Unauthorized: You are not Admin'));
                  }
                });
            }

            let userLogin = () => {
              return new Promise((resolve, reject) => {
                $.ajax('/login', {
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                      username: user,
                      password: password,
                    }),
                  })
                  .done((data) => { if (!data.error) { resolve() } else { reject(data.error) } })
                  .fail((data) => { reject(data) });
              });
            }
            userLogin().then(() => { userAuth() }, (data) => { $pageContent.append(fail(data)) });
      */
      // old way no prmises
      /*
      $.ajax('/login', {
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            username: user,
            password: password,
          }),
        })
        .done((data) => {
          if (!data.error) {
            $.ajax('/content', {
                method: 'GET',
                contentType: 'application/json',
              })
              .done((data) => {
                if (!data.error) {
                  buildApp();
                  localStorage.setItem('adminLoged', JSON.stringify(data));
                } else {
                  fail(data);
                }
              })
              .fail((data) => {
                if (data.status === 401) {
                  $('.alert-danger').remove();
                  $('.text-muted').prepend(fail('Unauthorized: You are not Admin'));
                }
              });
          } else {
            $('.alert-danger').remove();
            $('.text-muted').prepend(fail(data.error));
          }
        })
        .fail((data) => {
          $pageContent.append(fail(data));
        });
    }
*/
    }
    // navbar buttons
    if (clickId === 'new') {
      buildApp();
    }
    if (clickId === 'history') {
      reloadHistory();
    }
    if (clickId === 'topStudents') {
      console.log('top10');
    }
    if (clickId === 'deleteLateComer') {
      $.ajax(`/student/${dataId}`, {
          method: 'DELETE',
          contentType: 'application/json',
        })
        .done((data) => {
          if (!data.error) {
            $('.navbar').append(success(data.message)).fadeIn("slow");
            addInterHistory = setInterval(() => { reloadHistory() }, timeToReload);
          } else {
            fail(data.error);
          }
        })
        .fail((data) => {
          fail(data.error);
        });

    }

    if (clickId === 'logout') {
      $.ajax('/logout', {
          method: 'GET',
          contentType: 'application/json',
        })
        .done((data) => {
          if (!data.error) {
            buildLogin();
            localStorage.removeItem('adminLoged');
            fillForm();
          } else {
            console.log(data.error);
          }
        })
        .fail((data) => {
          console.log(data.error);
        });
    }

    if (clickId === 'addNew') {
      const lateComerName = $('#inputName').val();
      $.ajax('/add', {
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            name: lateComerName,
          }),
        })
        .done((data) => {
          $('.navbar').append(success(data.message)).fadeIn('slow');
          addInterAdd = setInterval(() => { buildApp() }, timeToReload);
        })
        .fail((data) => {
          console.log(data);
        });
    }
  });
});
