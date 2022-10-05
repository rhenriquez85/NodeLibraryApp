//
const addForm = document.querySelector(".library-add-delete");

addForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (event.submitter.innerText === 'Delete') return;

    addToLibrary();
});

// HELPERS
function addToLibrary(book) {
    let data = {};

    if (book) {
        data = book;
    }
    else {
        const bookDetails = ['title', 'author', 'genre'];
        for (const detail of bookDetails) {
            if (addForm.elements[detail].value === '') {
                const article = detail === 'author' ? 'an' : 'a';
                window.alert(`Please enter ${article} ${detail}.`);
                return;
            }
        }

        // const data = {};
        bookDetails.forEach((name) => {
            const property = addForm.elements[name];
            data[name] = property.value;
            property.value = '';
        });
    }

    const title = data['title'];
    const session = window.sessionStorage;
    const username = session.getItem('active_account');
    const database = session.getItem('database');

    if (username) {
        if (database === 'mySQL') {
            const parameters = {
                username,
                database,
                ...data,
            };
            const url = convertToURL('/add-to-library', parameters);    

            xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            xhr.send();

            xhr.addEventListener('load', () => {
                const data = JSON.parse(xhr.responseText);

                let bookToAdd = data.matched ? null : title;
                displayAddMessage(bookToAdd);
                if (bookToAdd) {
                    updateIndexedDB();
                }
            });
        }
    }
    else {
        const ids = convertLocalStorageToObj();
        let bookToAdd = title;
        Object.entries(ids).forEach(([id, book]) => {
            if (book.title === title) {
                bookToAdd = null;
            }
        });

        displayAddMessage(bookToAdd);
        if (!bookToAdd) return;
        const local = window.localStorage;
        const id = +local.getItem('__highest') + 1;
        local.setItem('__highest', id);
        local.setItem(id, JSON.stringify(data));
    }

    setTimeout(() => {
        window.location = window.location;
    }, 1300);
}

function displayAddMessage(name) {
    let html;
    if (name) {
        html = `<p class="book-added"><em>${name}</em> was added to the library!</p>`;
    }
    else {
        html = `<p class="book-deleted">Book already added.</p>`;
    }
    addForm.nextSibling?.remove();
    deleteForm.nextSibling?.remove();
    addForm.insertAdjacentHTML('afterend', html);
}

function addRandomBook() {
    const bookList = [
        { title: 'A Portrait of the Artist as a Young Man', author: 'James Joyce', genre: 'Fiction' },
        { title: 'As I Lay Dying', author: 'William Faulkner', genre: 'Fiction' },
        { title: 'A Farewell to Arms', author: 'Ernest Hemingway', genre: 'Fiction' },
        { title: 'Notes from Underground', author: 'Fyodor Dostoevksy', genre: 'Fiction' },
        { title: '1984', author: 'George Orwell', genre: 'Fiction' },

        { title: 'Foundation', author: 'Isaac Asimov', genre: 'Fiction' },
        { title: 'A Catcher in the Rye', author: 'J.D. Salinger', genre: 'Fiction' },
        { title: 'The Time Machine', author: 'H.G. Wells', genre: 'Fiction' },
        { title: 'War and Peace', author: 'Leo Tolstoy', genre: 'Fiction' },
        { title: 'Norwegian Wood', author: 'Haruki Murakami', genre: 'Fiction' },

        { title: "The Hitchhiker's Guide to the Galaxy", author: 'Douglas Adams', genre: 'Fiction' },
        { title: "The Lord of the Rings", author: 'J.R.R Tolkein', genre: 'Fiction' },
        { title: "A Hunger Artist", author: "Franz Kafka", genre: "Fiction" },
        { title: "The Shining", author: "Stephen King", genre: "Fiction" },
        { title: "The Little Prince", author: "Antoine de Saint-Exupéry", genre: "Fiction" },

        { title: 'The Wasteland', author: 'T.S. Eliot', genre: 'Poetry' },
        { title: 'The Divine Comedy', author: 'Dante', genre: 'Poetry' },
        { title: 'The Bridge', author: 'Hart Crane', genre: 'Poetry' },
        { title: 'Aenead', author: 'Virgil', genre: 'Poetry' },
        { title: 'Paradise Lost', author: 'John Milton', genre: 'Poetry' },

        { title: 'Tamerlane and Other Poems', author: 'Edgar Allan Poe', genre: 'Poetry' },
        { title: 'The Odyssey', author: 'Homer', genre: 'Poetry' },

        { title: 'The History of the Decline and Fall of the Roman Empire', author: 'Edward Gibbon', genre: 'History' },
        { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', genre: 'History' },
        { title: "A People's History of the United States of America", author: 'Howard Zinn', genre: 'History' },
        { title: "A History of the World in 6 Glasses", author: 'Tom Standage', genre: 'History' },
        { title: "A Short History of Nearly Everything", author: 'Bill Bryson', genre: 'History' },

        { title: "A Brief History of Everyone Who Ever Lived", author: "A. Rutherford", genre: "History"},
        
        { title: 'Ideas and Opinions', author: 'Albert Einstein', genre: 'Science' },
        { title: 'The Voyage of the Beagle', author: 'Charles Darwin', genre: 'Science' },
        { title: 'A Brief History of Time', author: 'Stephen Hawking', genre: 'Science' },
        { title: 'Civilization and Its Discontents', author: 'Sigmund Freud', genre: 'Science' },
        { title: 'My Inventions', author: 'Nikola Tesla', genre: 'Science' },

        { title: 'The Singularity is Near', author: 'Ray Kurzweil', genre: 'Technology' },
        { title: 'Steve Jobs', author: 'Walter Isaacson', genre: 'Technology' },
        { title: 'The Metaverse: And How It Will Revolutionize Everything', author: 'Matthew Bell', genre: 'Technology' },
        { title: 'Everyday Choas', author: 'David Weinberger', genre: 'Technology' },
        { title: 'The Age of A.I.', author: 'Henry Kissinger, Eric Schmidt, Daniel Huttenlocher', genre: 'Technology' },

        { title: 'The Intelligent Investor', author: 'Benjamin Graham', genre: 'Business' },
        { title: 'The Lean Startup', author: 'Eric Ries', genre: 'Business' },
        { title: 'The Psychology of Money', author: 'Morgan Housel', genre: 'Business' },
        { title: 'How to Win Friends & Influence People', author: 'Dale Carnegie', genre: 'Business' },

        { title: 'The Wealth of Nations', author: 'Adam Smith', genre: 'Economics' },
        { title: 'The Big Short: Inside the Doomsday Machine', author: 'Michael Lewis', genre: 'Economics' },
        { title: 'Why Nations Fail', author: 'Acemoguli, Robinson', genre: 'Economics' },
        { title: 'Money: The True Story of a Made-Up Thing', author: 'Jacob Goldstein', genre: 'Economics' },

        { title: 'The Republic', author: 'Plato', genre: 'Philosophy' },
        { title: 'Meditations on First Philosophy', author: 'René Descartes', genre: 'Philosophy' },
        { title: 'Twilight of the Idols', author: 'Friedrich Nietzsche', genre: 'Philosophy' },
        { title: 'Dao De Jing', author: 'Laozi', genre: 'Philosophy' },
        { title: 'The Revolt of the Masses', author: 'José Ortega y Gasset', genre: 'Philosophy' },

        { title: 'The Dark Knight Returns', author: 'Frank Miller', genre: 'Other' },
        { title: 'The League of Extraordinary Gentlemen', author: 'Alan Moore', genre: 'Other' },
        { title: 'Becoming', author: 'Michelle Obama', genre: 'Other' },
        { title: 'Rachael Ray Express Lane Meals', author: 'Rachael Ray', genre: 'Other' },
    ];

    const username = session.getItem('active_account');

    if (username) {
        let openRequest = indexedDB.open('store', 1);

        openRequest.onsuccess = () => {
            const db = openRequest.result;
            const transaction = db.transaction('books', 'readwrite');
            const objectStoreRequest = transaction.objectStore('books').getAll();

            objectStoreRequest.onsuccess = () => {
                books = objectStoreRequest.result;
                
                while (bookList.length > 0) {
                    const random =  Math.round(Math.random() *  bookList.length);
                    const index = random === bookList.length ? random - 1 : random;
                    let stopLoop; 
            
                    stopLoop = true;
                    for (let i = 0; i < books.length; i++) {
                        if (bookList[index].title === books[i].title) {
                            bookList.splice(index, 1);
                            stopLoop = false;
                            break;
                        }
                    }
        
                    if (!stopLoop) continue;
                    addToLibrary(bookList[index]);
                    db.close();
                    break;
                }
                db.close();
            };
        }
    }
    else {
        while (bookList.length > 0) {
            const random =  Math.round(Math.random() *  bookList.length);
            const index = random === bookList.length ? random - 1 : random;
            let stopLoop; 
    
            const books = Object.values(convertLocalStorageToObj());

            stopLoop = true;
            for (let i = 0; i < books.length; i++) {
                if (bookList[index].title === books[i].title) {
                    bookList.splice(index, 1);
                    stopLoop = false;
                    break;
                }
            }

            if (!stopLoop) continue;
            addToLibrary(bookList[index]);
            break;
        }
    }
}