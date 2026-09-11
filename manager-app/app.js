const form = document.querySelector("#add-form")
const tip  = document.querySelector("#tip")
const list = document.querySelector("#book-list")
const name_input   = document.querySelector("#book-name-input")
const author_input = document.querySelector("#book-author-input")
const rating_input = document.querySelector("#book-rating-input")
const export_btn = document.querySelector("#export-btn");

let books = JSON.parse(localStorage.getItem('books') || '[]')

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
        change_btn.classList.add('change-btn')
        delete_btn.textContent = '删除'
        delete_btn.classList.add('delete-btn')

        // 把这本书在 books 数组中的下标记录到 li 上
        li.dataset.index = books.indexOf(book);

        li.textContent = `《${book.name}》 | 作者: ${book.author} | 评分: ${book.rating}   `
        li.appendChild(change_btn)
        li.appendChild(delete_btn)
        list.appendChild(li)
    })
}

list.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const li = button.closest("li");
    if (!li) return;


    // 找到这本书在 books 数组中的下标
    const index = Number(li.dataset.index);

    if (button.classList.contains("change-btn")) {
        books[index].name   = prompt("重新输入书名：")
        books[index].author = prompt("重新输入作者：")
        let rating = prompt("重新输入评分：")
        while (rating !== null && Number.isNaN(Number(rating))) rating = prompt("评分应为数字，重新输入评分：")
        books[index].rating = rating;

        save();
        render();
    }

    if (button.classList.contains("delete-btn")) {
        books[index].show = false;

        save();
        render();
    }
});

const save = () => {
    try {
        localStorage.setItem('books', JSON.stringify(books));
    } catch (e) {
        console.error("数据保存失败：", e);

        tip.textContent = "保存失败：浏览器存储空间不足，请删除部分数据后重试。";
    }
};

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

    save()
    render()
})

export_btn.addEventListener("click", () => {
    const json = JSON.stringify(
        books.filter(book => book.show), // show为false的不导出
        (k, v) => {
            // 隐藏show属性
            if (k === 'show') return undefined
            return v
        }, 
        2
    );

    // 把JSON字符串转成Blob文件数据
    const blob = new Blob(
        [json],
        { type: "application/json" }
    );

    // 创建临时url
    const url = URL.createObjectURL(blob);

    // 创建一个超链接模拟点击后即可下载文件
    const a = document.createElement("a");
    a.href = url;
    a.download = "books.json";
    a.click();

    // 回收临时url
    URL.revokeObjectURL(url);
});

render()