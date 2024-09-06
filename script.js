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
        events: 'events.json',

        editable: true,
        droppable: true,

        drop: function (info) {
            info.draggedEl.parentNode.removeChild(info.draggedEl);
        }
    });
    calendar.render();
});


const fetchEvents = document.getElementById('external-events');

fetch("./list.json").then(res => res.json()).then(data => {
    data.forEach(event => {
        const eventEl = document.createElement('div');
        eventEl.innerText = event.title;
        eventEl.className = 'fc-event';
        fetchEvents.appendChild(eventEl);
    });
});