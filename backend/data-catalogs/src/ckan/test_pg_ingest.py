from venv import create
from sqlalchemy import create_engine
import psycopg2

QUERY = "COPY app.portals(api_endpoint_url,software_type,country_code_iso2,num_datasets,api_short_id) FROM '/pg_data_loading/portalwatch_selected.csv' DELIMITER ',' CSV HEADER;"
def test():
    print("starting")
    conn = psycopg2.connect("dbname=postgres user=postgres password=password host=0.0.0.0")

    c = conn.cursor()
    c.execute(QUERY)
    # conn.commit()
    c.close()
    conn.close()
    # engine = create_engine("postgres://postgres:password@0.0.0.0:5432/postgres")

    # c: psycopg2.cursor = engine.connect()
    # # with conn.cursor() as curs:
    # #     c: psycopg2.cursor = curs
    # c.execute(QUERY)
    # c.commit()
    # c.close()
    print("all done!")

test()