document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var containerEl = document.getElementById('external-events');

    new FullCalendar.Draggable(containerEl, {
        itemSelector: '.fc-event',
        eventData: function (eventEl) {
            return {

                title: eventEl.innerText.trim(),
                start: new Date(),
                end: new Date()


            };
        }
    });

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },

        editable: true,
        droppable: true,

        drop: function (info) {
            info.draggedEl.parentNode.removeChild(info.draggedEl);
        }
    });
    calendar.render();
    loadExternalEvents();
    loadEvents(calendar);
});


function loadEvents(calendar) {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', './events.json', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            calendar.addEventSource(data);
        } else if (xhr.readyState === 4) {
            console.error('Error loading calendar events:', xhr.statusText);
        }
    };
    xhr.send();
}

function loadExternalEvents() {
    const Events = document.getElementById('external-events');
    const xhr = new XMLHttpRequest();

    xhr.open('GET', './list.json', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            data.forEach(event => {
                const eventEl = document.createElement('div');
                eventEl.innerText = event.title;
                eventEl.className = 'fc-event';
                Events.appendChild(eventEl);
            });
        }
        else if (xhr.readyState === 4) {
            console.error('Error loading calendar events:', xhr.statusText);
        }
    };
    xhr.send();
}