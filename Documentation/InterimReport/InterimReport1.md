## 1	Specification

### 1.1 Motivation

### 1.2 Pointer Declerations

### 1.3 OTHER

### 1.4 Itemised Specification 

## 2		Background

### 2.1	Educational Coding
* Visualisation of system?
* Mental model - DON NORMAN!

### 2.2 Static Analysis
* Overview of current literature

### 2.3 Linters
* PC-Lint
* cppcheck
* Intellisense
* Visual Assisst
* Resharper
* Xcode?

### 2.4 User Interface and User Testing
* Review of Norman
* Testing users well
	* Quantity vs quality?

* Affordance (Norman)
* Button Links - DMMT
### 2.5 Backend Infrastructure

### 2.5.1 Program 
* C#
* .NET
* Elm
* Fable-Elmish
* FABLE
	* Use of Node.js - extensive libraries

### 2.5.2 C++ Parser
* Undecidable grammar!
* SWIG - Needs header file
* CastXML - 
* ANTLR - 
* Boost.Spirit
* Clang AST to XML
* Node.js bindings for libclang

Parsing C++ is no mean feat. 

For the purposes of this project, the output of the parser needs to be an abstract syntax tree, which the application has the capability of referring to. It can do this in two ways. The first, more sophisticated way, is through specific bindings to the AST. While this could be built around a parser in .NET, since F# is a language built for the .NET framework, FABLE itself is built primarily around Node.js. So, it would make sense to find bindings for the parser in C++. The second way would be to turn the complex C++ source into a more manageable data format (such as XML or JSON). This could be undertaken either using a Node.js module, or instead could be distinct from the rest of the infrastructure. We will explore examples of both.

In addition, there is the option to not parse C++ (owing to the complexity of the task) and instead just to use a parser of C. While this may become useful if project timings are an issue, if a reliable C++ parser is available, it is preferred. This is because C++ is a superset of C and, if time allows, there may be a possibility of focussing on some C++ only constructs within implementation. 

**SWIG**

**CastXML**

**ANTLR**

**Clang AST to XML**

**C Parser for Node**

**Libclang**


## 3		Implementation Plan

### 3.1 Completed Work

### 3.2 Future Milestones

### 3.3 Risks and Fallbacks

## 4		Evaluation Plan

### 4.1 Unit/Coverage Testing

### 4.2 User Testing

### 4.3 Evaluation against Competitors

