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

function mkInnerTable(data, late) {
  return $(`<tr>
            <th scope = "row"> ${data.name} </th>
            <td> ${data.day} </td>
            <td> ${data.hour} </td>
            <td> ${late} </td>
          </tr>`);
}


export default function mkTable(data) {
  const $el = $(mkTableHead);
  const $tableHead = $el.find('tbody');
  data.forEach((student) => {
    let minutesLateSum;
    const studentName = student.name;
    for (let i = 0; i < data.lenght; i += 1) {
      if (data[i].name === studentName) {
        minutesLateSum += data[i].minLate;
      }
    }
    const $tableBody = mkInnerTable(student, minutesLateSum);
    $tableHead.append($tableBody);
  });
  return $el;
}
