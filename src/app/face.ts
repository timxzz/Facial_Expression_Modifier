/**
 * Created by tim on 12/03/2018.
 */

export class Face {
  expressionId: number;
  expressionName: string;
  image: string;

  constructor(id:number, name:string, image:string){
    this.expressionId = id;
    this.expressionName = name;
    this.image = image;
  }
}
