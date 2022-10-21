from dagster import load_assets_from_package_module, repository

from dagster_checker import assets

@repository
def dagster_checker():
    return [load_assets_from_package_module(assets)]
