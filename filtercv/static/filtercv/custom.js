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
      updateTagFilter(data.words) // words is a array
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

  removeAllChildNodes(tbody);
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
    tbody.appendChild(tr);
  })

  changeContainerDisplay();
}


const removeAllChildNodes = parent => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

const filterTable = () => {
  let input, words, table, tr, td, i, txtValue;
  input = document.getElementsByClassName("filter_table")[0]
  words = input.value.toLowerCase().split(",")

  tbody = document.getElementById("tbody")
  tRows = tbody.getElementsByTagName("tr")


  for (i = 0; i < tRows.length; i++) {
    tRow = tRows[i];
    td = tRow.getElementsByTagName("td")[1];
    if (td) {
      presentTag = td.innerHTML.split(',').map(item => item.trim().toLowerCase());
      presentSearchedTag = true;

      if (words.length === ['']) {
        tRow.style.display = "";
      } else {

        words.forEach(word => {
          if (presentTag.indexOf(word) === -1) {
            presentSearchedTag = false;
          }

        })

        if (presentSearchedTag === false) {
          tRow.style.display = "none";
        } else {
          tRow.style.display = "";
        }
      }

    }
  }
}

const updateTagFilter = (words) => {
  document.getElementsByClassName("filter_table")[0].value = words.toString()
}
