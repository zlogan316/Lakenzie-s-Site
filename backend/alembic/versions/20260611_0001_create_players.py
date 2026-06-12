"""create players table and seed Lakenzie

Revision ID: 0001
Revises:
Create Date: 2026-06-11

NOTE: This migration is written ahead of time; run it once DATABASE_URL
points at the MSSQL database (alembic upgrade head).
"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    players = op.create_table(
        "players",
        sa.Column("id", sa.Integer(), sa.Identity(), primary_key=True),
        sa.Column("name", sa.String(length=50), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.text("SYSUTCDATETIME()"),
            nullable=False,
        ),
    )
    # MSSQL quirk: in offline (--sql) mode alembic wraps bulk_insert in
    # SET IDENTITY_INSERT ON/OFF, which requires an explicit id; in online
    # mode IDENTITY_INSERT stays off, so the id must be omitted.
    if op.get_context().as_sql:
        op.bulk_insert(players, [{"id": 1, "name": "Lakenzie"}])
    else:
        op.bulk_insert(players, [{"name": "Lakenzie"}])


def downgrade() -> None:
    op.drop_table("players")
