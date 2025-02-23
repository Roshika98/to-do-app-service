import { BeforeInsert, Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ nullable: true })
  password: string;

  @BeforeInsert()
  generateId() {
    this.id = uuid();
  }
}
