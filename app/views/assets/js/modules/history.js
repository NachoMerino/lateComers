const mkTableHead = `<table class="table">
                        <thead class="thead-dark">
                          <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Date</th>
                            <th scope="col">Time</th>
                            <th scope="col">Minutes Late</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                        </tbody>
                      </table>`;

function mkInnerTable(data) {
  return $(`<tr>
            <th scope ="row"> ${data.name} </th>
            <td> ${data.day} </td>
            <td> ${data.hour} </td>
            <td> ${data.minLate} </td>
            <td><button id="deleteLateComer" data-id="${data._id}" type="button" class="btn btn-secondary">Delete</button></td>
          </tr>`);
}


export default function mkTable(data) {
  const $el = $(mkTableHead);
  const $tableHead = $el.find('tbody');
  data.forEach((students) => {
    const $tableBody = mkInnerTable(students);
    $tableHead.append($tableBody);
  });
  return $el;
}
