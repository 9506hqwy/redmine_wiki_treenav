const wikiTreeNavLocalStorageKey = "redmine-wiki-treenav";

function addWikiTreePageRow(parent, data) {
    const container = document.createElement('tbody');
    container.innerHTML = data;

    const current = getWikiTreeNavPosition().pop();

    const children = container.querySelectorAll('tr');
    if (children.length == 0) {
        disableWikiTreePageExpander(parent);
        return;
    }

    for (const child of children) {
        for (const ex of child.querySelectorAll('.expander')) {
            ex.addEventListener('click', toggleWikiTreePage);
        }

        if (child.id == `treenav-${current}`) {
            const title = child.querySelector('a.name');
            title.classList.add('current');
        }

        parent.after(child);
        parent = child;
    }
}

function collapseWikiTreePageRow(row) {
    if (row.classList.contains('no-children')) {
        return;
    }

    const expander = row.querySelector('.expander');
    expander.classList.remove('icon-expended');
    expander.classList.remove('icon-expanded');
    expander.classList.add('collapsed');
    expander.classList.add('icon-collapsed');

    row.classList.add('collapsed');

    for (const child of document.querySelectorAll(`.${row.id}`)) {
        hideWikiTreePageRow(child);
    }
}

function disableWikiTreePageExpander(row) {
    row.classList.add("no-children");

    const expander = row.querySelector('.expander');
    expander.classList.remove('collapsed');
    expander.classList.remove('icon-collapsed');
    expander.classList.remove('icon-expended');
    expander.classList.remove('icon-expanded');
}

function displayWikiTreePageRow(row) {
    if (!row.classList.contains('collapsed')) {
        for (const child of document.querySelectorAll(`.${row.id}`)) {
            displayWikiTreePageRow(child);
        }
    }

    row.style.display = '';
}

function expandWikiTreePageRow(row) {
    if (row.classList.contains('no-children')) {
        return;
    }

    row.classList.remove('collapsed');

    const expander = row.querySelector('.expander');
    expander.classList.remove('collapsed');
    expander.classList.remove('icon-collapsed');
    expander.classList.add('icon-expended');
    expander.classList.add('icon-expanded');

    for (const child of document.querySelectorAll(`.${row.id}`)) {
        displayWikiTreePageRow(child);
    }

    initialWikiTreePage();
}

function getWikiTreeNavPosition() {
    if ('sessionStorage' in window) {
        const ids = sessionStorage.getItem(`${wikiTreeNavLocalStorageKey}-position`);
        return ids.split(',');
    }

    return [];
}

function getWikiTreeNavState() {
    if ('localStorage' in window) {
        return localStorage.getItem(`${wikiTreeNavLocalStorageKey}-state`);
    }

    return 'expanded';
}

function hideWikiTreePageRow(row) {
    for (const child of document.querySelectorAll(`.${row.id}`)) {
        hideWikiTreePageRow(child);
    }

    row.style.display = 'none';
}

function initialWikiTreePage() {
    if (getWikiTreeNavState() != 'expanded') {
        return;
    }

    const wrapper = document.getElementById('wiki-treenav-wrapper');
    if (wrapper.classList.contains('loaded')) {
        return;
    }

    const expanded = getWikiTreeNavPosition();
    const current = expanded.pop();

    for (const row of document.querySelectorAll('#wiki-treenav-wrapper tr')) {
        const pageId = row.id.replace('treenav-', '');
        if (expanded.includes(pageId) && row.classList.contains('collapsed')) {
            const expander = row.querySelector('.expander');
            expander.click();
        }

        if (current == pageId) {
            wrapper.classList.add('loaded')
        }
    }
}

function saveWikiTreeNavPosition(position) {
    if ('sessionStorage' in window) {
        sessionStorage.setItem(`${wikiTreeNavLocalStorageKey}-position`, position.toString());
    }
}

function saveWikiTreeNavState(state) {
    if ('localStorage' in window) {
        localStorage.setItem(`${wikiTreeNavLocalStorageKey}-state`, state);
    }
}

function toggleWikiTreeNav() {
    const main = document.getElementById('main');
    main.classList.toggle('collapsedwikitreenav');
    if (main.classList.contains('collapsedwikitreenav')) {
        updateWikiTreeNavIcon('chevrons-right');
        saveWikiTreeNavState('collapsed');
    } else {
        updateWikiTreeNavIcon('chevrons-left');
        saveWikiTreeNavState('expanded');
        initialWikiTreePage();
    }
}

function toggleWikiTreePage(e) {
    e.preventDefault();

    const row = document.getElementById(e.target.dataset.id);
    if (!row.classList.contains('collapsed')) {
        collapseWikiTreePageRow(row);
        return;
    } else if (row.classList.contains('loaded')) {
        expandWikiTreePageRow(row);
        return;
    } else if (row.classList.contains('loading')) {
        return;
    }

    const option = {
        method: 'GET',
        cache: 'no-cache',
    };

    row.classList.add('loading');
    fetch(e.target.dataset.url, option).then(function (response) {
        if (response.ok) {
            response.text().then(function (data) {
                addWikiTreePageRow(row, data);

                row.classList.remove('loading');
                row.classList.add('loaded');

                expandWikiTreePageRow(row);
            });
        } else {
            alert(`${response.status} : ${response.statusText}`);
        }
    });
}

function updateWikiTreeNavIcon(icon) {
    const button = document.getElementById('wiki-treenav-switch-button');
    for (const e of button.getElementsByTagName(('use'))) {
        const iconPath = e.getAttribute('href');
        e.setAttribute('href', iconPath.replace(/#.*$/g, "#icon--" + icon));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Enable collapse function.
    const button = document.getElementById('wiki-treenav-switch-button');
    button.addEventListener('click', toggleWikiTreeNav);

    // Enable tree function.
    for (const ex of document.querySelectorAll('#wiki-treenav-wrapper .expander')) {
        ex.addEventListener('click', toggleWikiTreePage);
    }

    // Enable collapsing button.
    const panel = document.getElementById('wiki-treenav-switch-panel');
    panel.style.visibility = 'visible';
});
