    const date = new Date();
    let hh = date.getHours();
    let mm = date.getMinutes();
    let month = date.getMonth() + 1;
    hh = hh < 10 ? '0' + hh : hh;
    mm = mm < 10 ? '0' + mm : mm;
    month = month < 10 ? '0' + month : month;
    const day = `${date.getDate()}.${month}.${date.getFullYear()}`;
    const hour = `${hh}:${mm}`;

    export { day, hour }
