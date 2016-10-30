
from sqlalchemy import create_engine
from configs import DB_URI

engine = create_engine(DB_URI)
