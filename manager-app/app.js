const form = document.querySelector("#add-form")
const tip  = document.querySelector("#tip")
const list = document.querySelector("#book-list")
const name_input   = document.querySelector("#book-name-input")
const author_input = document.querySelector("#book-author-input")
const rating_input = document.querySelector("#book-rating-input")

let books = []  // JSON.parse(localStorage.getItem('books') || '[]');

const render = () => {
    list.innerHTML = ''
    const shown = books.filter(book => book.show)
    if (shown.length === 0) {
        const li = document.createElement('li')
        li.textContent = '没有图书'
        list.appendChild(li)
        return
    }
    shown.forEach(book => {
        const li = document.createElement('li')
        const change_btn = document.createElement('button')
        const delete_btn = document.createElement('button')
        change_btn.textContent = '修改'
        change_btn.addEventListener('click', () => {
            book.name   = prompt("重新输入书名：")
            book.author = prompt("重新输入作者：") 
            book.rating = prompt("重新输入评分：")

            render()
        })
        delete_btn.textContent = '删除'
        delete_btn.addEventListener('click', () => {
            book.show = false
            render()
        })
        li.textContent = `《${book.name}》 | 作者: ${book.author} | 评分: ${book.rating}   `
        li.appendChild(change_btn)
        li.appendChild(delete_btn)
        list.appendChild(li)
    })
}

// const save = () => localStorage.setItem('books', JSON.stringify(books));

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name_text = name_input.value.trim();
    const author_text = author_input.value.trim();
    const rating_text = rating_input.value.trim();

    if (name_text === "") {
        tip.textContent = "书名不能为空";
        return;
    }
    if (author_text === "") {
        tip.textContent = "作者名不能为空";
        return;
    }
    if (rating_text === "") {
        tip.textContent = "评分不能为空";
        return;
    }

    books.push({ 
        name: name_text ,
        author: author_text,
        rating: rating_text,
        show: true,
    });
    tip.textContent = "";
    name_input.value = "";
    author_input.value = "";
    rating_input.value = "";

    render();
});

render();