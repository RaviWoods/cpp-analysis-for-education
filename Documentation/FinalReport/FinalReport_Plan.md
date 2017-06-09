# Abstract 
* **DRAFT**

---

# Introduction

---

# Background
* **UI testing research**
* **UI design** **DRAFT**
	* *Specific UI issues - pane_myers*

	* Choose an Appropriate Metaphor - pane_myers
	*  Consistency with Metaphor - pane_myers
	*  Closeness of Mapping - pane_myers
* **Coding for education** **DRAFT**
	* Difficulties in learning - pane_myers
		* *C++ was found to be more difficult than Java. Selection structures (C2), arrays (C5), pointers and references (C6), and parameters (C7) were perceived significantly more difficult when learning in C++ than in Java (p=0.05) : lahtinen_ala-mutka_jarvinen_2005*
		* What are the things?  
		* Our implementation focuses on pointers, arrays, parameters
		* While it identifies that C++ is more difficult to Java, it doesn't expose the whole story.
		* *Several of the respondents state that the teaching of pointers in Cpp comes much more easily after the students have had experience using Java. Pointers are not explicit in Java; instead, every object (other than primitive types) is always accessed by reference. This means the students become accustomed to the ‘pointer’ concept without worrying about the syntactical difficulties of pointer programming in C/Cpp as they no longer have to deal with source code that can be misleading and difficult to read due to the languages’ use of the ‘*’ and ‘&’ operators. - milne_rowe_2002*
		* Also, with regards to OO...
		* *Pointers and dynamic allocation of memory are obviously self-explanatory, yet there are a surprising number of more complex object-oriented concepts that can never fully be comprehended without the student first mastering pointers, and hence realising what their program is doing in memory. - milne_rowe_2002*
	* Mental models
		* *the students will struggle in their understanding until they gain a clear mental model of how their program is ‘working’—that is, how it is stored in memory, and how the objects in memory relate to one another - milne_rowe_2002*
		* In computing, this is...
		* *Notional machine is a model of the computer implied by the language - robins_rountree_rountree_2003*
		* This tool must be...
		* *Tool to observe the machine - glass box not black box; robins_rountree_rountree_2003*
		* Experts have models which are
		* *heirarchal, explicietly mapped, well founded in program text - robins_rountree_rountree_2003*
		* Visualisation helps novice programmers:
		* *in visual systems, relationships between components are expressed by lines rather than symbols, making it easier to follow the routes - pane_myers*
		* *iconic representation of components may be easier to discriminate and recognize than textual names and symbolically expressed relationships; - pane_myers*
		* However, the whole language shouldnt be visual:
		* *Visual languages are not more natural than text - pane_myers*
		* *graphical superlativism does not hold in larger more complex programs - pane_myers*

* **Competitors**  **DRAFT**
	* CDecl
		* Overview - Cdecl is a program which will turn English-like phrases such as "declare foo as array 5 of pointer to function returning int" into C declarations such as "int (*foo[5])()".  It can also translate the C into the pseudo- English
		* Problems: 1 - Doesn't work with complex declarations
		* Problems: 2 - Not visual
			* When is this an issue
		* Problems: 3 - Not integrated into an IDE
		* Could we use backend?
			* Possible, but would need to edit backend heavily
			* Also not necessarily easy to package (True? Quick try)
	
* **Static Analysis Research**
	* Static Analysis
		* Why is it usually undertaken? 
		* For bug finding
		* http://paginas.fe.up.pt/~ei05021/TQSO%20-%20An%20overview%20on%20the%20Static%20Code%20Analysis%20approach%20in%20Software%20Development.pdf
		* While static analysis can produce false negatives/positives, and can only solve certain types of bugs, its better than the usual software manual review cycle
		* Compared to dynamic analysis, it is often slower,
		* "One of the advantages of the static analysis approach during development is that	the code is forcefully directed in a way as to be reliable, readable and lees prone to	 errors on future tests. This also influences the verification of the code after it is ready, reducing the number of problems found in further implementations that code. "
		* Good static analysis tools must be easy to use. This means that their results must be  understandable to normal developers so that they educate their users about good programming practices. Another critical feature is the kind of knowledge (the rule set) the tool enforces. The importance of a good rule set can’t be overestimated. In the end, good static checkers can help spot and eradicate common security bugs. This is especially important for languages such as C, for which a very large corpus of rules already exists. "
		* How easy is it for C++?
		* http://blog.reverberate.org/2013/08/parsing-c-is-literally-undecidable.html
	* Parsing Declarations
		* The theory
		* http://progforperf.github.io/Expert_C_Programming.pdf
		* Putting it into practise
		* http://www.kau.edu.sa/Files/830/Files/55520_pdfvers.pdf 

---

# Requirements Capture

---

# Analysis and Design
* **Backend Infrastructure** **DRAFT**
	* Intro
		* Needs to be a Desktop App where the codebase can be moved to an IDE
		* Needs to be Cross Platform
		* Surely Web App then?
		* Choosing Desktop App over Web App because...
	* Language 
		* Eclipse and Visual Studio both equally used
		* However, Visual Studio and C++ is Windows only
		* Visual Studio is new for Mac, and VS Code also exists for Mac
		* VS and VSCode Extensions can be written using Node.JS and JS
		* Eclipse is Cross Platform
		* Eclipse Apps can be written in JS and JavaFX
	* Java App
		* JavaFX for Eclipse
		* WindowBuilder for Eclipse - "builds an abstract syntax tree (AST) to navigate the source code", but code base dead. 
		* True in the general case - development doesn't look very active, and not as "hackable"
		* Nice language, with styling support
	* Javascript App (Electron)
		* Fast
		* Hackable - Node access, HTML/CSS for UI, JS only add-ons
		* Cross Platform
		* Big
		* JS is idiosyncratic as a language 
	* Conclusion
		* Would make sense to use Eclipse
		* But likely will be easier and quicker to use Electron

* **Parsers** **DRAFT**
* **Graphing**

---

# Implementation
* **Infrasturture Design**
	* Flowchart
	* Debug levels vs Production
	* Cross-platform and App packaging 
* **JSON generation and TDD**
	* JSON reqs
	* QUnit Infrastructure
	* JSON generation from LibClang
* **Iterative Design in Graphing UI**
	* Initial drawings, with recursive layout patterns
	* Initial anecodatal tests
	* Issues from tests, and Solutions
	* Changes from Drawings to Implementation
	* Second anecdotal tests
	* Issues and Solutions
* **Overall Layout and UX**
	* Code Editor with Monaco
	* Graphing Layout 
	* Code to Graph Mapping

---

# Testing
* **UI Testing**
	* Question Set
	* Interviewees
	* Overview of Results
* **Coverage Testing**
	* Source Files
	* Failures/Issues in JSON generation
	* Failures/Issues in Graph generation

---

# Evaluation
* Failures of UI testing
* Failures/Shortcomings of code against QUnit tests 

---

# Conclusions and Further Work
* TBC

