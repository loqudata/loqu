# Use-cases

## Airline Performance

Search and find this: https://catalog.data.gov/dataset/airline-on-time-performance-and-causes-of-flight-delays

Which is a Data.gov CKAN index of the real record in the BTS Socrata with 4000 datasets: https://data.transportation.gov/Aviation/Airline-On-Time-Performance-and-Causes-of-Flight-D/r52d-vs5d

Both have a broken link to the actual resource:
https://www.transtats.bts.gov/DatabaseInfo.asp?QO_VQ=EFD&DB_URL=
https://www.transtats.bts.gov/Fields.asp?gnoyr_VQ=FGJ

The underlying catalog/DB is here: https://www.transtats.bts.gov/DataIndex.asp

Modified from our JQ script:

```json
{
  "title": "Airline On-Time Performance and Causes of Flight Delays",
  "description": "This database contains scheduled and actual departure and arrival times, reason of delay.  reported by certified U.S. air carriers that account for at least one percent of domestic scheduled passenger revenues. The data is collected by the Office of Airline Information, Bureau of Transportation Statistics (BTS).",
  "update_frequency": "monthly",
  "license_id": "us-pd",
  "org_name": "Department of Transportation",
  "resources": ["On_Time Data "],
  "tags": [
    "actual-arrival-time",
    "actual-departure-time",
    "air-carrier",
    "airport-code",
    "arrival-delay",
    "cancelled-flight",
    "enplaned-passengers",
    "gate-departure-time",
    "wheels-off-time"
  ]
}
```

`http --verbose POST 'https://catalog.data.gov/api/3/action/organization_show' id=dot-gov`

```json
{
    "help": "https://catalog.data.gov/api/3/action/help_show?name=organization_show",
    "result": {
        "approval_status": "approved",
        "created": "2020-11-10T14:13:01.158937",
        "description": "",
        "display_name": "Department of Transportation",
        "extras": [
            {
                "group_id": "c549d5ce-2b93-4397-ab76-aa2b31d9983a",
                "id": "5bbd22ea-8b57-4cb8-8436-856f0d69c87a",
                "key": "email_list",
                "revision_id": "beb19374-514c-436a-a225-3902042d9ad6",
                "state": "active",
                "value": "daniel.morgan@dot.gov\r\nhyon.kim@gsa.gov\r\n"
            },
            {
                "group_id": "c549d5ce-2b93-4397-ab76-aa2b31d9983a",
                "id": "f76fe99f-2ae0-45f6-9468-fe362aebf5b0",
                "key": "organization_type",
                "revision_id": "beb19374-514c-436a-a225-3902042d9ad6",
                "state": "active",
                "value": "Federal Government"
            }
        ],
        "groups": [],
        "id": "c549d5ce-2b93-4397-ab76-aa2b31d9983a",
        "image_display_url": "https://upload.wikimedia.org/wikipedia/commons/8/81/US_DOT_Triskelion.png",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/8/81/US_DOT_Triskelion.png",
        "is_organization": true,
        "name": "dot-gov",
        "num_followers": 0,
        "package_count": 1118,
        "revision_id": "ae087d25-8f93-4bf9-9555-3c1ab8bde8bd",
        "state": "active",
        "tags": [],
        "title": "Department of Transportation",
        "type": "organization",
        "users": [
            {
                "about": null,
                "activity_streams_email_notifications": false,
                "capacity": "admin",
                "created": "2021-10-22T20:40:37.453014",
                "display_name": "dominic.menegus dot.gov",
                "email_hash": "60b3ce11a4c3168e682b0fe0fd6ffb76",
                "fullname": "dominic.menegus dot.gov",
                "id": "1d9c4ea2-4fcf-4ddc-a39d-5745d077d5f0",
                "name": "dominic-menegus",
                "number_created_packages": 0,
                "number_of_edits": 0,
                "state": "active",
                "sysadmin": false
            }
        ]
    },
    "success": true
}
```

# Features to support

- Extracting field names and descriptions from various structures (HTML, PDF)
- Creating a dictionary/index of terms or acronyms from structured data like the [airline example](https://www.transtats.bts.gov/DatabaseInfo.asp?QO_VQ=EFD&DB_URL=) or just frequency/acrynym detection in text like PDF.
- Extracting other properties like update frequency from HTML: [eg](https://www.transtats.bts.gov/DatabaseInfo.asp?QO_VQ=EED&QO_fu146_anzr=Nv4%FDPn44vr45&QO_anzr=Nv4%FDPn44vr4%FDf6n6v56vp5%FD%FLS14z%FDHE%FDg4nssvp%FM-%FD%FDh.f.%FDPn44vr45&Yv0x=D)
