function newLateComer(day, hour) {
  const newLateComer = `<div class="container">
                        <div class="row">
                          <div class="col-sm">
                            <input type="text" id="inputName" placeholder="Enter LateComer Name">
                          </div>
                          <div class="col-sm">
                            <input type="text" id="inputDate" placeholder="date" value="${day}">
                          </div>
                          <div class="col-sm">
                            <input type="text" id="inputTime" placeholder="hour" value="${hour}">
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-sm-12 addNew">
                          <button id="addNew" type="button" class="btn btn-secondary">Add</button>
                          </div>
                        </div>
                      </div>`
  return newLateComer;
}
export default newLateComer;