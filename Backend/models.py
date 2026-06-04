from typing import Optional
import datetime
import decimal

from sqlalchemy import BigInteger, Boolean, Column, DateTime, Double, ForeignKeyConstraint, Identity, Integer, Numeric, PrimaryKeyConstraint, String, Table, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import OID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass


class Lote(Base):
    __tablename__ = 'lote'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='lote_pkey'),
    )

    id: Mapped[int] = mapped_column(Integer, Identity(start=1, increment=1, minvalue=1, maxvalue=2147483647, cycle=False, cache=1), primary_key=True)
    chapas_quantidade: Mapped[Optional[int]] = mapped_column(Integer)
    peso_total: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(10, 2))
    data_emissao: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    data_termino: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)

    chapas: Mapped[list['Chapas']] = relationship('Chapas', back_populates='lote')


t_pg_stat_statements = Table(
    'pg_stat_statements', Base.metadata,
    Column('userid', OID),
    Column('dbid', OID),
    Column('toplevel', Boolean),
    Column('queryid', BigInteger),
    Column('query', Text),
    Column('plans', BigInteger),
    Column('total_plan_time', Double(53)),
    Column('min_plan_time', Double(53)),
    Column('max_plan_time', Double(53)),
    Column('mean_plan_time', Double(53)),
    Column('stddev_plan_time', Double(53)),
    Column('calls', BigInteger),
    Column('total_exec_time', Double(53)),
    Column('min_exec_time', Double(53)),
    Column('max_exec_time', Double(53)),
    Column('mean_exec_time', Double(53)),
    Column('stddev_exec_time', Double(53)),
    Column('rows', BigInteger),
    Column('shared_blks_hit', BigInteger),
    Column('shared_blks_read', BigInteger),
    Column('shared_blks_dirtied', BigInteger),
    Column('shared_blks_written', BigInteger),
    Column('local_blks_hit', BigInteger),
    Column('local_blks_read', BigInteger),
    Column('local_blks_dirtied', BigInteger),
    Column('local_blks_written', BigInteger),
    Column('temp_blks_read', BigInteger),
    Column('temp_blks_written', BigInteger),
    Column('shared_blk_read_time', Double(53)),
    Column('shared_blk_write_time', Double(53)),
    Column('local_blk_read_time', Double(53)),
    Column('local_blk_write_time', Double(53)),
    Column('temp_blk_read_time', Double(53)),
    Column('temp_blk_write_time', Double(53)),
    Column('wal_records', BigInteger),
    Column('wal_fpi', BigInteger),
    Column('wal_bytes', Numeric),
    Column('jit_functions', BigInteger),
    Column('jit_generation_time', Double(53)),
    Column('jit_inlining_count', BigInteger),
    Column('jit_inlining_time', Double(53)),
    Column('jit_optimization_count', BigInteger),
    Column('jit_optimization_time', Double(53)),
    Column('jit_emission_count', BigInteger),
    Column('jit_emission_time', Double(53)),
    Column('jit_deform_count', BigInteger),
    Column('jit_deform_time', Double(53)),
    Column('stats_since', DateTime(True)),
    Column('minmax_stats_since', DateTime(True))
)


t_pg_stat_statements_info = Table(
    'pg_stat_statements_info', Base.metadata,
    Column('dealloc', BigInteger),
    Column('stats_reset', DateTime(True))
)


class Usuario(Base):
    __tablename__ = 'usuario'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='supervisorindustrial_pkey'),
        UniqueConstraint('email', name='usuario_emailsupervisor_key'),
        UniqueConstraint('telefone', name='usuario_telefonesupervisor_key')
    )

    id: Mapped[int] = mapped_column(Integer, Identity(start=1, increment=1, minvalue=1, maxvalue=2147483647, cycle=False, cache=1), primary_key=True)
    nome: Mapped[Optional[str]] = mapped_column(String(255))
    matricula: Mapped[Optional[int]] = mapped_column(Integer)
    telefone: Mapped[Optional[int]] = mapped_column(BigInteger)
    email: Mapped[Optional[str]] = mapped_column(String(255))
    senha: Mapped[Optional[str]] = mapped_column(Text)

    setor: Mapped[list['Setor']] = relationship('Setor', back_populates='usuario')


class Setor(Base):
    __tablename__ = 'setor'
    __table_args__ = (
        ForeignKeyConstraint(['id_user'], ['usuario.id'], name='setor_id_user_fkey'),
        PrimaryKeyConstraint('id', name='setor_pkey')
    )

    id: Mapped[int] = mapped_column(Integer, Identity(start=1, increment=1, minvalue=1, maxvalue=2147483647, cycle=False, cache=1), primary_key=True)
    id_user: Mapped[Optional[int]] = mapped_column(Integer)
    setor: Mapped[Optional[str]] = mapped_column(Text)
    chapas_quantidade: Mapped[Optional[int]] = mapped_column(Integer)

    usuario: Mapped[Optional['Usuario']] = relationship('Usuario', back_populates='setor')
    chapas: Mapped[list['Chapas']] = relationship('Chapas', back_populates='setor')


class Chapas(Base):
    __tablename__ = 'chapas'
    __table_args__ = (
        ForeignKeyConstraint(['id_lote'], ['lote.id'], name='chapas_id_lote_fkey'),
        ForeignKeyConstraint(['id_setor'], ['setor.id'], name='chapas_id_setor_fkey'),
        PrimaryKeyConstraint('id', name='chapas_pkey')
    )

    id: Mapped[int] = mapped_column(Integer, Identity(start=1, increment=1, minvalue=1, maxvalue=2147483647, cycle=False, cache=1), primary_key=True)
    id_lote: Mapped[Optional[int]] = mapped_column(Integer)
    id_setor: Mapped[Optional[int]] = mapped_column(Integer)
    peso: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(10, 2))
    altura: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(10, 2))
    material: Mapped[Optional[str]] = mapped_column(String(255))
    espessura: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(10, 2))
    data_entrada: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    data_saida: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)

    lote: Mapped[Optional['Lote']] = relationship('Lote', back_populates='chapas')
    setor: Mapped[Optional['Setor']] = relationship('Setor', back_populates='chapas')
