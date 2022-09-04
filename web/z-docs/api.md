# The Loqu API

We have a few different resource types:

- a **Dataset** can have many **Resource**s - files of different types that contain data. Loqu currently only handles tabular data
  - Some datasets have a default Resource
- **User**
- **Publisher**

## Dataset

TODOs:

- [ ] relationship between field order and field groups

```json
{
  "title": "Airline On-Time Performance and Causes of Flight Delays",
  "description": "This database contains scheduled and actual departure and arrival times, reason of delay.  reported by certified U.S. air carriers that account for at least one percent of domestic scheduled passenger revenues. The data is collected by the Office of Airline Information, Bureau of Transportation Statistics (BTS).",
  "update_frequency": "monthly",
  "license_id": "us-pd",
  //   For org card - maybe hover - name, image, 1 sentence description
  "organization": {
    "name": "Department of Transportation",
    "id": "dot-gov (or loqu ID)"
  },
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
  ],
  "fields": [
    {
      "name": "OntimeArrivalPct",
      "description": "Percent of flights that arrive on time. For percent of on time arrivals at specific airports, click Analysis. Note: If you select Origin as a category, you get percent of flights that depart from those airports and arrive on time.",
      "order": 0,
      "fieldGroup": null
    },
    {
      "name": "Reporting_Airline",
      "description": "	Unique Carrier Code. When the same code has been used by multiple carriers, a numeric suffix is used for earlier users, for example, PA, PA(1), PA(2). Use this field for analysis across a range of years.",
      "order": 1,
      "fieldGroup": "Airline"
    }
  ]
}
```

## Database

Audit history: https://www.cybertec-postgresql.com/en/row-change-auditing-options-for-postgresql/

Action: Create, Update, Delete; and User; change time; fields changed (for update)

hopefully, way to query full data at given time/revision

Want to show a change list/history like:

User A **updated** the **license** of the dataset



User B **renamed** the dataset (special verb for combination: type:update, field:name)


Also want to show changes to
- resources
- fields

which w