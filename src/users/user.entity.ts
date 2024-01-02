import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../auth/role.entity";

@Entity("user_info")
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: "varchar",
    length: 512
  })
  username: string

  @Column({
    type: "varchar",
    length: 512
  })
  email: string

  @Column({
    type: "varchar",
    length: 512
  })
  password: string

  @ManyToMany(() => Role)
  @JoinTable({
    name: "users_to_roles",
    joinColumn: {
      name: "user_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "role_id",
      referencedColumnName: "id"
    }
  })
  roles: Role[]
}