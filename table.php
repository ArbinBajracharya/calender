<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
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

            <div class="view-events">
                <button class="btn btn-primary" id="view-events"><a href="index.php" class="text-white"
                        style="text-decoration: none;">View
                        Calendar</a></button>
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
    <script>
    // Initialize DataTable
    $(document).ready(function() {
        var eventTable = $('#eventTable').DataTable();
        console.log(eventTable);

        // Load events into DataTable via AJAX or directly from the database
        loadEventsIntoTable();

        // Filter by date range
        $('#startDate, #endDate').on('change', function() {
            eventTable.draw();
        });

        // Custom date range filtering logic for DataTable
        $.fn.dataTable.ext.search.push(
            function(settings, data, dataIndex) {
                var min = new Date($('#startDate').val());
                var max = new Date($('#endDate').val());
                var startDate = new Date(data[1]);

                if (
                    (isNaN(min.getTime()) && isNaN(max.getTime())) ||
                    (isNaN(min.getTime()) && startDate <= max) ||
                    (min <= startDate && isNaN(max.getTime())) ||
                    (min <= startDate && startDate <= max)
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
    });

    // Print data
    document.getElementById('print').addEventListener('click', function() {
        var table = document.getElementById('eventTable');
        var printWindow = window.open('', '', );

        printWindow.document.write('<html><head><title>Print Data</title>');

        //Basic table styles
        printWindow.document.write(
            '<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 8px; text-align: left; }</style>'
        );

        // Write only the table content to the print window
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
            success: function(response) {
                var events = response;
                var eventTable = $('#eventTable').DataTable();
                events.forEach(function(event) {
                    eventTable.row.add([
                        event.title,
                        event.start ? new Date(event.start).toLocaleDateString() : '',
                        event.end ? new Date(event.end).toLocaleDateString() : '',
                        event.extendedProps.description,
                        event.extendedProps.type,
                        event.extendedProps.badge,
                        event.extendedProps.status
                    ]).draw();
                });
            }
        });
    }
    </script>

</body>

</html>