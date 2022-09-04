# from enum import Enum
from dataclasses import dataclass
from typing import Optional
from datetime import datetime


from dacite import from_dict
# class Software(Enum):
#     CKAN = "CKAN"
#     CKANDCAT = "CKANDCAT"

@dataclass
class NocoDBPortal:
    id: int
    title: str
    apiuri: str
    uri: Optional[str]
    short_id: Optional[str]
    software: str
    iso: str
    created_at: datetime
    updated_at: datetime
    num_datasets: Optional[int]