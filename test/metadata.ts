// import "reflect-metadata";

// @atClassWithArgs(1, 2, 3)
// class SecondClass {}

// @atClass
// export default class FirstClass {
//   public resolve() {
//     console.log("resolve111");
//   }
// }

// const obj = new SecondClass();

// // console.log("FirstClass对象调用getName()取得装饰器赋值：", obj.getName());

// // 类装饰器
// function atClass(target: any) {
//   console.log("类装饰器，类名是：", target.name);
//   const t = new target();
//   t.resolve();
//   // console.log();t.resolve()
// }

// // 类装饰器，带参数
// function atClassWithArgs(...args: any[]) {
// return function(target: any) {
//   console.log("类装饰器有参数，参数值：", args.join(","));
// };
// }

// // 方法装饰器
// function atMethod(target: any, propertyKey: string) {
//   const returnType: any = Reflect.getMetadata("design:returntype", target, propertyKey);
//   console.log("方法装饰器，获得返回类型：", returnType.name);
// }

// // 方法装饰器，带参数
// function atMethodWithArgs(...args: any[]) {
//   return function(target: any, propertyKey: string) {
//     console.log("方法装饰器有参数，参数值：", args.join(","));
//   };
// }

// // 成员变量装饰器
// function atProperty(target: any, propertyKey: string) {
//   const propertyType: any = Reflect.getMetadata("design:type", target, propertyKey);
//   console.log("变量装饰器，获得变量类型：", propertyType.name);
// }

// // 成员变量装饰器，带参数
// function atPropertyWithArgs(...args: any[]) {
//   return function(target: any, propertyKey: string) {
//     console.log("变量装饰器有参数，参数值：", args.join(","));
//     Object.defineProperty(target, propertyKey, {
//       get: () => {
//         return args;
//       },
//     });
//   };
// }

// // 访问器装饰器
// function atAccessor(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//   const returnType: any = Reflect.getMetadata("design:type", target, propertyKey);
//   console.log("访问器装饰器，访问器类型是：", returnType, "，值是：", target[propertyKey]);
// }

// // 访问器装饰器，带参数
// function atAccessorWithArgs(...args: any[]) {
//   return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     console.log("访问器装饰器，参数值：", args.join(","));
//   };
// }

// // 参数装饰器
// function atParameter(target: any, propertyKey: string, parameterIndex: number) {
//   const parameterType: any = Reflect.getMetadata("design:paramtypes", target, propertyKey);
//   console.log(
//     "参数装饰器，参数位置在：",
//     parameterIndex,
//     "参数类型是：",
//     parameterType[parameterIndex].name,
//   );
// }

// // 参数装饰器，带参数
// function atParameterWithArgs(...args: any[]) {
//   return function(target: any, propertyKey: string, parameterIndex: number) {
//     console.log("参数装饰器有参数，参数值：", args.join(","));
//   };
// }
// 定义一个类装饰器
