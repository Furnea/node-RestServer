
//includes a repository 

import { Request, Response } from "express"
import { prisma } from "../../data/postgres";

const todos = [
                { id: 1, text: 'do homework', completedAt: new Date() },
                { id: 2, text: 'clean room', completedAt: null },
                { id: 3, text: 'buy food', completedAt: new Date() },
            ];

export class TodosController {

    constructor(){
    }

    public getTodos = async (req: Request, res: Response) => {
        const todos = await prisma.todo.findMany();
            return res.json( todos );
    }

    public getTodoById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if ( isNaN( id ) ) return res.status( 400 ).json( { error: 'ID argument is not a number' } );

        try {
            const todo = await prisma.todo.findUnique({
                where: {id},
            });
            if ( !todo ) throw new Error();
            return res.json( todo );
        } catch (error) {
            return res.status( 404 ).json( { error: `Todo with id ${ id } not found` } );
        }
    };

    public createTodo = async (req: Request, res: Response) => {
        const { text: textNewTodo } = req.body;
        if ( !textNewTodo ) return res.status( 400 ).json( { error: 'Text property is required' } );
        try {
        const todo = await prisma.todo.create({
            data: { text: textNewTodo }
        });
        return res.json( todo );
        } catch (error) {
            return res.status( 400 ).json( { error: `error ${error} creating the todo` } );
        }

    }

        
    public updateTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if ( isNaN( id ) ) return res.status( 400 ).json( { error: 'ID argument is not a number' } );
        const { text } = req.body;
        if ( !text ) return res.status( 400 ).json( { error : "text message is required" } );
        try {
            const data = await prisma.todo.update({
            where: { id },
            data: { text: text}
            });
            if (!data) throw new Error();
            return res.json(data);
        } catch (error) {
        return res.status( 404 ).json( { error : `Todo with ${id} dont exist` } );
        }
        
    };

    public deleteTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if ( isNaN( id ) ) return res.status( 400 ).json( { error: 'ID argument is not a number' } );
        try {
            const todo = await prisma.todo.delete({
                where: {id}
            });
            if( !todo ) throw new Error();
            return res.json({ deleted : `Todo with id : ${id} was deleted `}); 
        } catch (error) {
            return res.status( 404 ).json( { error : `Todo with id : ${id} not found `})
        }
    };

}
