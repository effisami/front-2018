$(document).ready(() => {
    let url='https://www.forverkliga.se/JavaScript/api/crud.php';
    let apiKey = '';
    let books = {};
    $('#sami-apikey-button').click(getApiKey);
    
    $('#sami-addbook-button').click(addBook);
    $('#sami-viewall-button').click(viewAll);
    $('#sami-changebook-button').click(updateBook);
    $('#sami-deletebook-button').click(deleteBook);

    function addBook() {
        let data = {
            title: $("#s-book-title").val(),
            author: $("#s-book-author").val()
        };
        let apiParam = {
            method: "GET",
            data: data
        };
        apiParam.data.op = "insert";
        apiParam.data.key = apiKey;
        $.ajax(url, apiParam)
            .done(response => {
                response = JSON.parse(response);
                if (response.status == "error") {
                    showError(response.message);
                    return;
                }
                books[response.id] = data;
                showAllBooks();
            })
            .fail(error => {console.log(`ERROR ${error}`);})
    }

    function viewAll() {
        let apiParam = {
            method: "GET",
            data: {
                op: "select",
                key: apiKey    
            }
        };
        $.ajax(url, apiParam)
            .done(response => {
                response = JSON.parse(response);
                if (response.status == "error") {
                    showError(response.message);
                    return;
                }
                books = {};
                result = response.data;
                for (let i in result) {
                    let book = result[i];
                    console.log(book);
                    books[book.id] = {
                        title: book.title,
                        author: book.author
                    };
                }
                showAllBooks();
            })
            .fail(error => {console.log(`ERROR ${error}`);})
    }

    function deleteBook() {
        let apiParam = {
            method: "GET",
            data: {
                id: $("#s-book-id").text(),
                op: "delete",
                key: apiKey
            }
        };
        $.ajax(url, apiParam)
            .done(response => {
                response = JSON.parse(response);
                if (response.status == "error") {
                    showError(response.message);
                    return;
                }
                delete books[response.id];
                showAllBooks();
            })
            .fail(error => {console.log(`ERROR ${error}`);})
    }

    function updateBook() {
        let data = {
            id: $("#s-book-id").text(),
            title: $("#s-book-title").val(),
            author: $("#s-book-author").val()
        };
        let apiParam = {
            method: "GET",
            data: data
        };
        apiParam.data.op = "update";
        apiParam.data.key = apiKey;
        $.ajax(url, apiParam)
            .done(response => {
                response = JSON.parse(response);
                if (response.status == "error") {
                    showError(response.message);
                    return;
                }
                let bookId = $("#s-book-id").text()
                books[parseInt(bookId)] = data;
                showAllBooks();
            })
            .fail(error => {console.log(`ERROR ${error}`);})
    }

    function getApiKey() {
        $.ajax(url,{method: 'GET', data: 'requestKey'}).done(
            function(data){
                data = JSON.parse(data);
                apiKey = data.key;
                $('#apikey-span').text(data.key);
            }).fail(function(data){
                console.log(`ERROR ${data}`);
            });
    }

    function showAllBooks() {
        console.log(books)
        $('#s-books-list').empty();
        for (let key in books) {
            let book = `
            <input type="radio" id="" name="books-radiobuttons" value="${key}">
            <label for="contactChoice1">${books[key].title} By ${books[key].author}</label>
            <br>`;
            $('#s-books-list').append(book);
        }
        $("input[name='books-radiobuttons']").change(function(){
            let bookId = $("input[name='books-radiobuttons']:checked").val();
            $("#s-book-id").text(bookId);
            $("#s-book-author").val(books[bookId].author);
            $("#s-book-title").val(books[bookId].title);
        });
    }

    function showError(msg) {
        $('#s-error-span').text(msg);
    }
});