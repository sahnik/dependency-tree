This is a dependency visualization app using React.

# JSON input
* The data used to produce the graph will be provided in a JSON file
* The JSON will be structured like this:
    { "job" : "name_of_job", "dependencies":["list","of","dependencies"], "sources":["list","of","sources"], "targets":["list","of","targets"], "color":"color to show node in"}
* The node should be named based on the job attribute
* The color of the node should be based on the color attribute
* The list of source and targets should be displayed when hovering over the job


# UI
* The graph should be interactive
  * Should be able to zoom in and out
  * Should be able to move nodes around
  * List of source and targets should display when hovering over a node
  * The nodes don't need to all fit on a single view, but should be able to pan the view
* Should be able to search for a specific job and bring the focus to that point.