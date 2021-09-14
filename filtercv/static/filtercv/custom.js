'use strict';
(function (document, window, index) {

	// Selected Elements
	const sections = document.querySelectorAll('.section');//home section and result section
	const input_files = document.getElementById('input_files');// Upload/add file
	const file_table = document.getElementById('file_table'); // A table body
	const dropbox = document.getElementById('dropbox'); // For drag and drop
	const filter_file_table_input = document.getElementById('filter_file_table_input');
	const tags__placed = document.querySelector('.tags__placed');
	const tag__input = document.querySelector('.tag__input');
	const input = document.querySelector('.tag__input input');
	const reset_btn = document.getElementById('reset_btn');
	const submit_btn = document.getElementById('submit_btn');
	const input_tags_for_searching = document.getElementById('result_searching_tags')
	const result_table = document.getElementById('result_table');
	const previous_btn = document.getElementById('previous_btn');


	// Some variables to store data
	let selected_files = [];
	// let tags = ['python', 'javascript'];
	let tags = [];


	// When file are added/removed.
	// added can be from upload bttton or drag n drop event
	// remove can be done from selected_files
	const update_file_table = () => {

		// Remove any content in table
		file_table.textContent = '';
		// Needed some file validation on the basic of types and size

		selected_files.forEach((el, i) => {
			const table_row = document.createElement('tr');
			const file_name = document.createElement('td');
			const file_size = document.createElement('td');
			const file_action = document.createElement('td');

			// table_row.setAttribute("id", "d-" + `${i}`)
			file_name.innerHTML = `<i class="fas fa-file-pdf"> </i> ${el.name}`
			file_size.textContent = bytes_to_size(el.size);
			file_action.innerHTML = `<i class="far fa-trash-alt" ></i>`
			file_action.onclick = remove_row;
			// file_action.onclick = remove_row;

			table_row.appendChild(file_name);
			table_row.appendChild(file_size);
			table_row.appendChild(file_action);
			file_table.appendChild(table_row);
		})
	}

	// When files are added to input
	input_files.addEventListener('change', e => {
		selected_files = [...selected_files, ...input_files.files];
		update_file_table();
	});

	// Search for a specific file in file_table
	filter_file_table_input.addEventListener('keyup', e => {
		const word_search = filter_file_table_input.value.toLowerCase();
		const tr = file_table.getElementsByTagName('tr');
		for (let i = 0; i < tr.length; i++) {
			const td = tr[i].getElementsByTagName('td')[0];
			if (td) {
				const txtValue = td.textContent || td.innerText;
				if (txtValue.toLowerCase().indexOf(word_search) > -1) {
					tr[i].style.display = '';
				} else {
					tr[i].style.display = 'none';
				}
			}
		}
	})

	// When reset button is pressed. 
	reset_btn.addEventListener('click', () => {
		input_files.value = '';
		selected_files = [];
		update_file_table();
	})

	const bytes_to_size = bytes => {
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		if (bytes == 0) return '0 Bytes'
		const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
	}

	// Below line is for drag and drop
	['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (event) {
		dropbox.addEventListener(event, function (e) {
			// preventing the unwanted behaviours
			e.preventDefault();
			e.stopPropagation();
		});
	});
	['dragover', 'dragenter'].forEach(function (event) {
		dropbox.addEventListener(event, function () {
			dropbox.classList.add('is-dragover');
		});
	});
	['dragleave', 'dragend', 'drop'].forEach(function (event) {
		dropbox.addEventListener(event, function () {
			dropbox.classList.remove('is-dragover');
		});
	});

	dropbox.addEventListener('drop', (e) => {
		const dropped_files = e.dataTransfer.files; // the files that were dropped
		selected_files = [...selected_files, ...dropped_files]
		update_file_table();
	});

	const remove_row = (e) => {
		const delete_index = e.srcElement.parentElement.parentElement.rowIndex;
		selected_files.splice(delete_index - 1, 1);
		update_file_table();
	}


	// Handling Tag part
	const createTag = entered_value => {
		const div = document.createElement('div');
		div.setAttribute('class', 'tag');
		const span = document.createElement('span');
		div.setAttribute('class', 'tag');
		span.innerHTML = entered_value;
		const closeBtn = document.createElement('i');
		closeBtn.setAttribute('class', 'fas fa-times');
		closeBtn.setAttribute('data-item', entered_value);

		div.appendChild(span);
		div.appendChild(closeBtn);
		return div;
	}

	// First all tags and create tag for every items present in tags variable
	const addTags = () => {
		reset()
		tags.forEach(tag => {
			const tag_div = createTag(tag);
			tags__placed.prepend(tag_div);
		})
	}

	// Remove preious tag element to create new element present in tags variable
	const reset = () => {
		document.querySelectorAll('.tag').forEach(tag => {
			tag.parentElement.removeChild(tag);
		});
	}

	tag__input.addEventListener('keyup', e => {
		reset();
		if (e.key === 'Enter') {
			tags.push(input.value);
			addTags();
			input.value = '';
		}
	});

	document.addEventListener('click', e => {
		if (e.target.tagName === 'I') {
			const value = e.target.getAttribute('data-item');
			const index = tags.indexOf(value);
			tags = [...tags.slice(0, index), ...tags.splice(index + 1)]
			addTags();
		}
	});

	submit_btn.onclick = (e) => {
		e.preventDefault();

		const formData = new FormData();
		tags.forEach(tag => {
			formData.append('tags', tag)
		})
		selected_files.forEach(file => {
			formData.append('files', file);
		})
		formData.append('csrfmiddlewaretoken', csrfmiddlewaretoken);
		const req = new Request('', {
			body: formData,
			method: 'POST',
		});
		fetch(req)
			.then(res => res.json())
			.then(data => {
				console.log(data)
				update_result_table(data)
				toggle_section();
			})
			.catch(console.warn)
		return false;
	}

	const removeAllChildNodes = parent => {
		while (parent.firstChild) {
			parent.removeChild(parent.firstChild);
		}
	}

	const update_result_table = (data) => {
		removeAllChildNodes(result_table);
		Object.entries(data.result).forEach(report => {
			console.log(report);

			let tr = document.createElement("tr");

			const file_name = document.createElement('td');
			const file_tags = document.createElement('td');

			file_name.innerHTML = `<i class="fas fa-file-pdf"> </i> ${report[0]}`
			file_tags.textContent = report[1].join(', ')


			tr.appendChild(file_name);
			tr.appendChild(file_tags);
			result_table.appendChild(tr);
		})

	}

	const toggle_section = () => {
		sections.forEach(el => {
			el.classList.toggle('hide_section');
		});
	}


	const filter_result_table = () => {

		const input_tags_array = input_tags_for_searching.value.toLowerCase().split(',').map(t => t.trim());
		const result_table = document.getElementById('result_table');
		const filter_tags = result_searching_tags.value.toLowerCase()
		const result_table_rows = result_table.getElementsByTagName('tr');

		for (let i = 0; i < result_table_rows.length; i++) {
			let result_tags = result_table_rows[i].getElementsByTagName('td')[1];
			if (result_tags) {
				result_tags = result_tags.textContent || result_tags.innerText;
				result_tags = result_tags.split(',').map(t => t.trim().toLowerCase());

				if (input_tags_array[0] == '') {
					result_table_rows[i].style.display = '';
				} else {

					let present_searched_tag = true;
					input_tags_array.forEach(input_word => {
						let found = false;
						result_tags.forEach(result_word => {
							if (result_word.indexOf(input_word) !== -1) {
								found = true;
							}
						})
						if (!found) present_searched_tag = false
					})
					if (present_searched_tag === false) {
						result_table_rows[i].style.display = 'none';
					} else {
						result_table_rows[i].style.display = '';
					}
				}
			}
		}
	}

	result_searching_tags.addEventListener('keyup', filter_result_table);
	// result_searching_tags.onkeyup(filter_result_table);

	previous_btn.addEventListener('click', e => {
		e.preventDefault();
		toggle_section();
	})

}(document, window, 0));
