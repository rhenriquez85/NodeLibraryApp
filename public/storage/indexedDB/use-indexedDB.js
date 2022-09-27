//
if (!window.sessionStorage.getItem('active_account')) {
    indexedDB.deleteDatabase('store');
}

const observer = new MutationObserver(updateIndexedDB);
observer.observe(document.querySelector('.login-name'), { 
    childList: true,
});