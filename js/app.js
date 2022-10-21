"use strict";

const root = document.querySelector("#root");

const UI = {
	title: document.createElement("h1"),
	subTitle : document.createElement("p"),
	form : document.createElement("form"),
	screenBlock: document.createElement("div"),
	screenInput: document.createElement("input"),
	screenAddBtn: document.createElement("button"),
	listsBlock: document.createElement("div"),

	elementOptions () {
		this.title.textContent = "CRUD";
		this.subTitle.textContent = "Asyn Application"

		this.form.id = "app-form";
		this.screenBlock.id = "screenBlock";
		this.screenInput.type = "text";
		this.screenInput.placeholder = "Type here...";
		this.screenAddBtn.textContent = "ADD";
		this.screenAddBtn.id = "screenAddBtn";
		this.listsBlock.id = "listBlock";
	},

	appendElements () {
		root.append(this.title, this.subTitle, this.form, this.listsBlock);
		this.form.append(this.screenBlock);
		this.screenBlock.append(this.screenInput, this.screenAddBtn);
	},

	start () {
		this.elementOptions();
		this.appendElements();
	}
}

UI.start();

const url = "http://localhost:8888/todos";

const CRUD = {
	GET (url) {
		return fetch(url);
	},
	POST (url, data) {
		fetch(url, {
			method: "POST",
			headers: { "content-type" : "application/json" },
			body: JSON.stringify({ title: data })
		})
	},
	PUT (url, data) {
		fetch(url, {
			method: "PUT",
			headers: { "content-type" : "application/json" },
			body: JSON.stringify({ title: data })
		})
	},	
	DELETE (url) {
		fetch(url, {
			method: "DELETE"
		})
	}
}

const { GET, POST, PUT, DELETE } = CRUD;

UI.form.addEventListener("submit", function(e) {
	e.preventDefault();
	const val = UI.screenInput.value.trim();

	if (val !== "") {
		POST(url, val);	//POST
	}

	this.reset();
});

GET(url).then(data => data.json())	//GET
.then(data => {
	data.forEach(todo => {
		UI.listsBlock.innerHTML += `
			<div class="listsBlockItem">
				<div class="listsBlockItemContent">
					<span>${todo.id}</span>
					<input type="text" value="${todo.title}" readonly>
				</div>
				<div class="buttons">
					<button class="removeBtn">Remove</button>
					<button class="editBtn">Edit</button>
					<button class="saveBtn">Save</button>
					<button class="doneBtn">Finished</button>
				</div>
			</div>
		`;
	});
	return data;
})
.then(data => {
	const removeBtns = document.querySelectorAll(".removeBtn");
	const editBtns = document.querySelectorAll(".editBtn");
	const saveBtns = document.querySelectorAll(".saveBtn");
	const doneBtns = document.querySelectorAll(".doneBtn");

	editBtns.forEach((btn, index) => {
		btn.addEventListener("click", function () {
			const input = this.parentElement.previousElementSibling.lastElementChild;

			input.classList.add("edit");
			input.removeAttribute("readonly");

			saveBtns.forEach((saveBtn, saveBtnIndex) => {
				if (index === saveBtnIndex) {
					saveBtn.style.display = "inline-block";
					btn.style.display = "none";
				}
			});
		})
	});

	doneBtns.forEach((donebtn) => {
		donebtn.addEventListener("click", function () {
			const listItem = this.parentElement;
			listItem.firstElementChild.style.display = "none";
			listItem.firstElementChild.nextElementSibling.style.display = "none";			
			donebtn.textContent = "Done";
		})
	});

	function changeDB (btnArray, method) {
		btnArray.forEach(rm => {
			rm.addEventListener("click", (e) => {
				data.forEach(todo => {
					const fakeId = rm.parentElement.previousElementSibling.firstElementChild.textContent;
					const forEddited = rm.parentElement.previousElementSibling.lastElementChild;
					if (parseInt(fakeId) === todo.id) {						
						method === "PUT" ? PUT(`${url}/${todo.id}`, forEddited.value.trim()) : DELETE(`${url}/${todo.id}`) //PUT/DELETE
					}
				});
			});
		});
	}
	
	changeDB(removeBtns, "DELETE");
	changeDB(saveBtns, "PUT");
});

/* 
	Ստեղծել 4 ֆունցկիա հետևյալ անուններով՝ GET, POST, PUT, DELETE ու անել այնպես
	որպեսզի էդ 4 ֆունկցիաները առանց որևիցէ խնդրի աշխատեն մեր տվյալների բազայի ու
	ամենակարևորը մեր UI-ի հետ

	Հ․Գ․ CSS-ում փոխել եմ բոլոր կլասներն ու այդիները, որպեսզի հին կոդի հետ չաշխատեն
*/