// var eventType = localStorage.getItem('eventType') || 'all';

// // Function to update the global variable and store it in localStorage
// function setEventType(newType) {
//     eventType = newType;
//     localStorage.setItem('eventType', eventType);
// }

// $(document).ready(function () {
//     $('#filter-events .btn').on('click', function () {
//         var selectedType = $(this).data('type');
//         setEventType(selectedType);
//     });
// });

// $(document).ready(function () {
//     $('#viewTableBtn').on('click', function () {
//         const eventType = 'personal'; // Replace this with your logic to get the eventType
//         const quotedEventType = `"${eventType}"`; // Add quotes around the value

//         // Create a new URL object
//         const url = new URL('http://localhost/calendar_php/table.php');

//         // Update the eventType parameter
//         url.searchParams.set('eventType', quotedEventType);

//         // Redirect to the new URL
//         window.location.href = url.toString();
//     });
// });

$(document).ready(function () {
    // Event listener for the button click
    $('#viewTableBtn').on('click', function () {
        // Get the current URL
        const url = new URL(window.location.href);

        // Redirect to table.php with the same parameters
        window.location.href = `table.php?${url.searchParams.toString()}`;
    });
});

// function getEventTypeFromURL() {
//     const params = new URLSearchParams(window.location.search);
//     return params.get('eventType') ? JSON.parse(params.get('eventType')) : null;
// }

// // Example usage
// const urleventType = getEventTypeFromURL();
// console.log(urleventType);