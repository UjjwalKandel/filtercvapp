for (const el of document.querySelectorAll('.tagin')) {
  tagin(el)
}

document.getElementById('submit').onclick = (e) => {
  e.preventDefault();

  var formData = new FormData(document.getElementById('file_upload'));

  const req = new Request('', {
    body: formData,
    method: 'POST',
  });
  fetch(req)
    .then((res) => res.json())
    .then((data) => {
      updateTable(data)
    })
    .catch(console.warn);

  return false;
}

const changeContainerDisplay = () => {
  container1 = document.querySelector('.container1');
  container2 = document.querySelector('.container2');
  if (container1.classList.contains('active')) {
    container1.classList.replace('active', 'inactive');
    container2.classList.replace('inactive', 'active');
  } else {
    container1.classList.replace('inactive', 'active');
    container2.classList.replace('active', 'inactive');
  }
}

const updateTable = (data) => {
  tbody = document.getElementById("tbody");
  Object.entries(data.result).forEach(el => {

    let tr = document.createElement("tr");
    const name = document.createElement('td');
    const tags = document.createElement('td');
    const cv = document.createElement('td');

    const link = document.createElement('a')
    link.textContent = el[0]
    cv.appendChild(link);

    name.textContent = el[0].split('.pdf')[0]
    tags.textContent = el[1].join(', ')

    tr.appendChild(name);
    tr.appendChild(tags);
    tr.appendChild(cv);
    tbody.appendChild(tr)
  })

  changeContainerDisplay();
}