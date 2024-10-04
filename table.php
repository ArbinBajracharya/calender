<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
</head>

<body>
    <div class="container mt-4">
        <div class="events-handle d-flex justify-content-between mb-3">
            <div id="filter-events" class="d-flex justify-content-between">
                <div class="form-group">
                    <label for="startDate">Start Date:</label>
                    <input type="date" id="startDate" class="form-control" />
                </div>
                <div class="form-group ms-4">
                    <label for="endDate">End Date:</label>
                    <input type="date" id="endDate" class="form-control" />
                </div>
                <div class="view-events ms-4">
                    <button class="btn btn-secondary ms-4" id="clear-filters">Clear</button>
                </div>
            </div>
            <div>
                <label for="eventTypeFilter">Filter by Event Type:</label>
                <select id="eventTypeFilter">
                    <option value="all">All</option>
                    <option value="personal">Personal</option>
                    <option value="project">Project</option>
                    <option value="organization">Organization</option>
                </select>
            </div>
            <div class="view-events">
                <button class="btn btn-primary" id="view-events"><a href="index.php" class="text-white"
                        style="text-decoration: none;">View Calendar</a></button>
            </div>
        </div>

        <!-- DataTable -->
        <table id="eventTable" class="table table-striped table-hover table-bordered">
            <thead class="thead-light">
                <tr>
                    <th>Title</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Badge</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <!-- Table data will be populated here -->
            </tbody>
        </table>
        <div class="view-events">
            <button class="btn btn-info ms-2" id="print">Print Data</button>
        </div>
    </div>


    <script src="https://code.jquery.com/jquery-3.6.0.min.js">
    </script>
    <script type="text/javascript" src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <script src="retrive.js">
    </script>
    <script>
        // Initialize DataTable
        $(document).ready(function() {
            var eventTable = $('#eventTable').DataTable();

            // Load events into DataTable via AJAX or directly from the database
            loadEventsIntoTable();

            // Filter by date range
            $('#startDate, #endDate').on('change', function() {
                eventTable.draw();
            });

            // Custom date range filtering logic for DataTable
            $.fn.dataTable.ext.search.push(
                function(settings, data, dataIndex) {
                    var min = $('#startDate').val() ? new Date($('#startDate').val()).toISOString().slice(0,
                        10) : null;
                    var max = $('#endDate').val() ? new Date($('#endDate').val()).toISOString().slice(0, 10) :
                        null;
                    var startDate = new Date(data[1]).toISOString().slice(0, 10);

                    if (
                        (!min && !max) || // No range set
                        (!min && startDate <= max) || // Only max set, include equal to max
                        (min <= startDate && !max) || // Only min set
                        (min <= startDate && startDate <= max) // Both set, include equal to min and max
                    ) {
                        return true;
                    }
                    return false;
                }
            );

            // Clear filters button 
            $('#clear-filters').on('click', function() {
                $('#startDate').val('');
                $('#endDate').val('');
                eventTable.draw();
            });

            // Print data
            $('#print').on('click', function() {
                var table = document.getElementById('eventTable');
                var printWindow = window.open('', '');

                printWindow.document.write('<html><head><title>Print Data</title>');
                printWindow.document.write(
                    '<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 8px; text-align: left; }</style>'
                );
                printWindow.document.write('</head><body>');
                printWindow.document.write(table.outerHTML);
                printWindow.document.write('</body></html>');

                printWindow.document.close();
                printWindow.print();
            });

            // Load events into the DataTable
            function loadEventsIntoTable() {
                $.ajax({
                    url: 'fetch.php',
                    method: 'GET',
                    dataType: 'json',
                    success: function(response) {
                        var events = response;
                        events.forEach(function(event) {
                            eventTable.row.add([
                                event.title,
                                event.start ? event.start.slice(0, 10) : '',
                                event.end ? event.end.slice(0, 10) : '',
                                event.extendedProps.description,
                                event.extendedProps.type,
                                event.extendedProps.badge,
                                event.extendedProps.status
                            ]).draw();
                        });
                    }
                });
            }
            // var eventtype = $_GET['eventType'];

            const params = new URLSearchParams(window.location.search);
            const eventType = params.get('eventType') ? JSON.parse(params.get('eventType')) : null;
            console.log('Event Type:', eventType); // Debugging

            $('#eventTypeFilter').val(eventType);

            filterByEventType(eventType);

            //Filter by event type
            $('#eventTypeFilter').on('change', function() {
                var eventType = $(this).val();
                filterByEventType(eventType);

                const url = new URL(window.location.href);
                url.searchParams.set('eventType', JSON.stringify(
                    eventType)); // Update the eventType parameter
                window.history.pushState({}, '', url);
            });

            function filterByEventType(eventType) {
                console.log('Event Type:', eventType); // Debugging
                if (!eventType || eventType === 'all') {
                    eventTable.search('').columns().search('').draw(); // Clear all search filters
                } else {
                    eventTable.column(4).search(eventType).draw(); // Filter by event type
                    console.log('Filtering by event type: ' + eventType);
                }
            }

            console.log('Event Type:', eventType); // Debugging

        });
    </script>

</body>

</html>