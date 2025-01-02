import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  
  @Entity('videos')
  export class Video {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column()
    title: string;
  
    @Column('text', { nullable: true })
    description: string;
  
    @Column()
    duration: number;
  
    @Column()
    genre: string;
  
    @Column("simple-array")
    tags: string[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }  