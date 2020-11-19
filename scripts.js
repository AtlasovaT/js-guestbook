$(function () {

    let notes = DB;
    let notesWrapper =  $('#comments-list');
    let popupForm = $('.needs-validation');

    console.log(notes.getAllRecords());
    renderAllNotes(notes.getAllRecords());
    // создание записи
    function createNote(name, message) {
        let id = idGeneration();
        let pubDate = new Date();
        let newNote;
        newNote = {
            id: id,
            author: name,
            message: message,
            pubDate: pubDate,
            editDate: null,
            comments: []
        };
        return newNote;
    }

    // добавление записи
    function addNote(name, message) {
        let note = createNote(name, message);
        notes.addRecords(note);
        renderingNote(note);
        notes.getAllRecords();
    }

    // отрисовка добавленной карточки на странице
    function renderingNote(note) {
                    let noteExemplar = `<article id="card_${ note.id }" class="card note-card">\n` +
                '            <div class="card-body">\n' +
                `                <h3 class="cart-title">${ note.author }</h3>\n ` +
                `                <p class="user-comment">${ note.message }</p>\n` +
                '            </div>\n' +
                '            <div class="card-footer">\n' +
                `                <small class="pub-date">${ note.pubDate }</small>\n` +
                '                <button class="btn btn-secondary btn-sm comment-this" data-toggle="modal" data-target="#exampleModalComment">comments this</button>\n' +
                '                <button class="btn btn-primary btn-sm edit-note" data-toggle="modal" data-target="#exampleModalEdit">edit this</button>\n' +
                '                <button class="btn btn-danger btn-sm delete-note">delete this</button>\n' +
                '            </div>\n' +
                '            \n' +
                        `<div class="sub-comments-list p-2"></div>` +
                '        </article>';
            notesWrapper.append(noteExemplar);
    }

    // отрисовка всех карточек на странице
    function renderAllNotes(list) {
        let recordsArray = list;
        Object.keys(recordsArray).forEach(function(key) {
            let date;

            if (recordsArray[key].editDate !== null) {
                date = 'Edited: ' + formatDate(recordsArray[key].editDate);
            } else {
                date = 'Pub date: ' + formatDate(recordsArray[key].pubDate);
            }
            let commentsList = '';
            for (let i = 0; i < recordsArray[key].comments.length; i++) {
                commentsList += `<article class="card">\n ` +
                    '<div class="card-body">\n ' +
                    `<h6>${ recordsArray[key].comments[i].commentAuthor }</h6>\n ` +
                    `<p>${ recordsArray[key].comments[i].commentMessage }</p>\n ` +
                    '</div>\n ' +
                    '<div class="card-footer">\n ' +
                    `<small>${ 'Pub date: ' + formatDate(recordsArray[key].comments[i].commentDate) }</small>\n ` +
                    ' </div>\n ' +
                    ' </article>';

            }

            let noteExemplar = `<article id="card_${ recordsArray[key].id }" class="card note-card">\n` +
                '            <div class="card-body">\n' +
                `                <h3 class="cart-title">${ recordsArray[key].author }</h3>\n ` +
                `                <p class="user-comment">${ recordsArray[key].message }</p>\n` +
                '            </div>\n' +
                '            <div class="card-footer">\n' +
                `                <small class="pub-date">${ date }</small>\n` +
                '                <button class="btn btn-secondary btn-sm comment-this" data-toggle="modal" data-target="#exampleModalComment">comments this</button>\n' +
                '                <button class="btn btn-primary btn-sm edit-note" data-toggle="modal" data-target="#exampleModalEdit">edit this</button>\n' +
                '                <button class="btn btn-danger btn-sm delete-note">delete this</button>\n' +
                '            </div>\n' +
                '            \n' +
                `<div class="sub-comments-list p-2">` + commentsList +`</div>\n` +
                '</article>';
            let noteList = document.getElementById('comments-list');
            noteList.insertAdjacentHTML('beforeend', noteExemplar);
        }, recordsArray);
    }

    // генерация id для текущего record
    function idGeneration() {
        let key = 1;
        if (localStorage.getItem('idGenerate') == null) {
            localStorage.setItem('idGenerate', String(key));
        } else {
            key = JSON.parse(localStorage.getItem('idGenerate')) + 1;
            localStorage.setItem('idGenerate', String(key));
        }
        return key;
    }

    // удаление записи
    function deleteNote(noteId) {
        notes.deleteRecord(noteId);
    }

    // редактирование записи
    function editNote(noteId, editedMessage) {
        //console.log(editedMessage);
        let object = notes.getAllRecords();
        let editDate = new Date();
        let editedItem;
        Object.keys(object).forEach(function(key) {
            if (object[key].id == noteId) {
                object[key].message = editedMessage;
                object[key].editDate = editDate;
                editedItem = object[key];
            }
        }, object);
        notes.updateRecord(editedItem);
    }

    // получение данных с текущей карточки в попап
    function getPopupData(noteId, noteText) {
        popupForm.attr("id", `needs-validation--${ noteId }`);
        popupForm.find('#edit_message').text(noteText);
    }

    // привязка уникального id к попапу публикации комментария
    function getCommentPopupId(id) {
        $('.send-comments').attr('id', `create-comment--${ id }`);
        return id;
    }

    // отправляем комментарий
    function sendComment(noteId, authorComment, messageComment, datePubComment) {
        let allNotes = notes.getAllRecords();
        let commentExemplar = {
            commentId: noteId,
            commentAuthor: authorComment,
            commentMessage: messageComment,
            commentDate: datePubComment
        };

        Object.keys(allNotes).forEach(function(key) {
            if (allNotes[key].id == noteId) {
                allNotes[key].comments.push(commentExemplar);
                return allNotes[key];
            }
        }, allNotes);

        notes.saveRecords();
    }

    // форматирование даты
    function formatDate(date) {
        let get = new Date(date);
        let day,
            month,
            year,
            hours,
            minutes;
        function addZero(value) {
            return (value < 10) ? ('0' + value) : value;
        }
        day = addZero(get.getDate());
        month = addZero(get.getMonth() + 1);
        year = get.getFullYear();
        hours = addZero(get.getHours());
        minutes = addZero(get.getMinutes());
        let dateString = hours + ':' + minutes + ' ' + day + '.' + month + '.' + year;
        return dateString;
    }

    // поиск по записям
    function Search(searchField, dateFrom, dateTo) {
        let allRecords = notes.getAllRecords();
        let filterRecords = allRecords.filter(function (item) {
            let date;
            if (item.editDate !== null) {
                date = new Date(item.editDate);

            } else {
                date = new Date(item.pubDate);
            }


            let formatDateFrom = new Date(dateFrom.replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1'));
            let formatDateTo = new Date(dateTo.replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1'));
            // if ((date >= formatDateFrom)) {
            //     console.log(date);
            // }
            if (item.author.includes(searchField) && (date >= formatDateFrom) && (date <= formatDateTo)) {
                return item;
            }
        });

       return filterRecords;

    }

    // отправка данных с формы
    $(document).on('submit', '#add-comments', function () {
        let name = $(this).find('#name').val();
        let message = $(this).find('#message').val();
        addNote(name, message);
    });

    // удаление добавленного элемента по кнопке
    $(document).on('click', '.delete-note', function () {
        let currentElement = $(this).closest('.note-card');
        let currentElementId = currentElement.attr("id");
        let noteId = parseInt(currentElementId.replace(/[^\d]/g, ''));
        deleteNote(noteId);
        currentElement.remove();
    });

    // редактирование элемента
    $(document).on('click', '.edit-note', function () {
        let currentElement = $(this).closest('.note-card');
        let currentElementId = currentElement.attr("id");
        let noteId = parseInt(currentElementId.replace(/[^\d]/g, ''));
        let noteText = currentElement.find('.user-comment').text();
        getPopupData(noteId, noteText);
    });

    // отправляем отредактированное значение в карточку
    $(document).on('click', '.save-changes', function () {
        let editedMessage = $('#edit_message').val();
        let editId = $(this).closest('.edit-comments').attr('id');
        let noteId = parseInt(editId.replace(/[^\d]/g, ''));
        if (editedMessage !== '') {
            editNote(noteId, editedMessage);
        }
    });

    //оставить комментарий к записи
    $(document).on('click', '.comment-this', function () {
        let currentElement = $(this).closest('.note-card');
        let currentElementId = currentElement.attr("id");
        let noteId = parseInt(currentElementId.replace(/[^\d]/g, ''));
        getCommentPopupId(noteId);
    });

    // отправка комментария с формы
    $(document).on('click', '.send-changes', function (e) {
        let currentElement = $(this).closest('.send-comments');
        let currentElementId = currentElement.attr("id");
        let noteId = parseInt(currentElementId.replace(/[^\d]/g, ''));
        let authorComment = currentElement.find('#commentator_name').val();
        let messageComment = currentElement.find('#comment_message').val();

        if (authorComment !== '' && messageComment !== '') {
            let datePubComment = new Date();

            let commentItem = `<article class="card" id="comment_${ noteId }">\n ` +
                '<div class="card-body">\n ' +
                `<h6>${ authorComment }</h6>\n ` +
                `<p>${ messageComment }</p>\n ` +
                '</div>\n ' +
                '<div class="card-footer">\n ' +
                `<small>${ datePubComment }</small>\n ` +
                ' </div>\n ' +
                ' </article>';

            let getAllNotes = document.querySelectorAll('.note-card');
            for (let i = 0; i < getAllNotes.length; i++) {
                let getNoteId = getAllNotes[i].id;
                let getKeyId = parseInt(getNoteId.replace(/[^\d]/g, ''));
                if (noteId == getKeyId) {
                    getAllNotes[i].querySelector('.sub-comments-list').append(commentItem);
                }
            }
            sendComment(noteId, authorComment, messageComment, datePubComment);
        }
    });
    // спецом на немецком:)
    jQuery.datetimepicker.setLocale('de');

    jQuery('.date-input').datetimepicker({
        i18n:{
            de:{
                months:[
                    'Januar','Februar','März','April',
                    'Mai','Juni','Juli','August',
                    'September','Oktober','November','Dezember',
                ],
                dayOfWeek:[
                    "So.", "Mo", "Di", "Mi",
                    "Do", "Fr", "Sa.",
                ]
            }
        },
        timepicker:false,
        format:'d.m.Y'
    });


    // отправка данных для поиска
    $(document).on('click', '.search-button', function (e) {
        let searchField = $('#search-field').val();
        let dateFrom = $('#search-date-from').val();
        let dateTo = $('#search-date-to').val();
        let searchResult = Search(searchField, dateFrom, dateTo);
        if (searchField !== '' && dateFrom !== '' && dateTo !== '') {

            let allExemplars = document.querySelectorAll('.note-card');
            for (let i = 0; i < allExemplars.length; i++) {
                allExemplars[i].remove();
            }
            renderAllNotes(searchResult);

        }
        e.preventDefault();
        e.stopPropagation();
    });
    $('.sub-comments-list').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: '<a href="javascript(0);" class="prev"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\n' +
            '  <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>\n' +
            '</svg></a>',
        nextArrow: '<a href="javascript(0);" class="next"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\n' +
            '  <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>\n' +
            '</svg></a>',
    });
});


