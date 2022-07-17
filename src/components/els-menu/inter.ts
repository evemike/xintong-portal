
export type MenuItem = {label:string,path:string,children?:MenuItem[],show?:boolean,isSub?:boolean,isGroup?:boolean} & Record<string,any>
