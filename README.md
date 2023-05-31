# frederikstevens1997.github.io
## traveltool 
### Adding element to the json-file.
Add the location to the locations.json file. The location should be added in the following format:
```
{
    "name": "Name of the location",
    "val": "the id for the name"
}
```
Thereafter add the location to the matrix.json. This must be done in 2 directions. First create a new row with as starting point, the from value, the newly added location. The new row should be added in the following format:
```
{
    "from": "the id for the new location",
    "to": "the id for an existing location",
    "links": [link1, link2, ...],
    "link-text": ["link1-text", "link2-text", ...],
    "link-names": ["link1-name", "link2-name", ...],
    "emission-plane": "emission value plane",
    "emission-alt": "emission value alt"
}
```
Create a new row with the newly added location as the starting point and all existing locations.  

Lastly repeat this proces with all existing locations as the starting point and the newly added location as the end point. The new row should be added in the following format:
```
{
    "from": "the id for an existing location",
    "to": "the id for the new location",
    "links": [link1, link2, ...],
    "link-text": ["link1-text", "link2-text", ...],
    "link-names": ["link1-name", "link2-name", ...],
    "emission-plane": "emission value plane",
    "emission-alt": "emission value alt"
}
```