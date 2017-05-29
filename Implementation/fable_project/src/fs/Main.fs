module App.Main
open Fable.Core.JsInterop
open Fable.Import

[<EntryPoint>]    
let main args = 
    let parser: JsFunc2<string,string,_> = import "parser" "../js/parser.js"
    let fileDir = "/Users/raviwoods/Google_Drive/ICComp/Uni_Year_3/Project/cpp-analysis-for-education/Implementation/CodeSamples/ParserTesting/"
    let fileName = "ptrsbasic.cpp"
    let testParser = parser.Invoke(fileDir,fileName)
    0
