"use strict";(self.webpackChunknidle_site=self.webpackChunknidle_site||[]).push([[274],{876:function(e,n,t){t.d(n,{Zo:function(){return s},kt:function(){return u}});var a=t(2784);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function l(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?l(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var p=a.createContext({}),c=function(e){var n=a.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},s=function(e){var n=c(e.components);return a.createElement(p.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},m=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,l=e.originalType,p=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),m=c(t),u=r,k=m["".concat(p,".").concat(u)]||m[u]||d[u]||l;return t?a.createElement(k,o(o({ref:n},s),{},{components:t})):a.createElement(k,o({ref:n},s))}));function u(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var l=t.length,o=new Array(l);o[0]=m;var i={};for(var p in n)hasOwnProperty.call(n,p)&&(i[p]=n[p]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var c=2;c<l;c++)o[c]=t[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,t)}m.displayName="MDXCreateElement"},7330:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return i},contentTitle:function(){return p},metadata:function(){return c},toc:function(){return s},default:function(){return m}});var a=t(7896),r=t(1461),l=(t(2784),t(876)),o=["components"],i={id:"develop",title:"MonoRepo \u9879\u76ee\u5f00\u53d1",sidebar_position:6},p=void 0,c={unversionedId:"developer/develop",id:"developer/develop",isDocsHomePage:!1,title:"MonoRepo \u9879\u76ee\u5f00\u53d1",description:"\u4ee5\u4e0b\u662f\u5e38\u89c1\u7684 MonoRepo \u4ed3\u5e93\u76ee\u5f55\u7ed3\u6784\uff1a",source:"@site/docs/developer/develop.md",sourceDirName:"developer",slug:"/developer/develop",permalink:"/nidle/docs/developer/develop",editUrl:"https://github.com/yanuoda/nidle/edit/main/packages/nidle-site/docs/developer/develop.md",version:"current",sidebarPosition:6,frontMatter:{id:"develop",title:"MonoRepo \u9879\u76ee\u5f00\u53d1",sidebar_position:6},sidebar:"developer",previous:{title:"\u6587\u6863\u7f16\u5199",permalink:"/nidle/docs/developer/document"},next:{title:"\u4efb\u52a1\u8ba1\u5212",permalink:"/nidle/docs/developer/plan"}},s=[{value:"\u4f9d\u8d56\u7ba1\u7406",id:"\u4f9d\u8d56\u7ba1\u7406",children:[]},{value:"\u53d1\u5e03\u7ba1\u7406",id:"\u53d1\u5e03\u7ba1\u7406",children:[]},{value:"\u5176\u4ed6\u5e38\u7528\u547d\u4ee4",id:"\u5176\u4ed6\u5e38\u7528\u547d\u4ee4",children:[]},{value:"\u4ee3\u7801\u63d0\u4ea4",id:"\u4ee3\u7801\u63d0\u4ea4",children:[]},{value:"\u53c2\u8003\u8d44\u6599",id:"\u53c2\u8003\u8d44\u6599",children:[]}],d={toc:s};function m(e){var n=e.components,t=(0,r.Z)(e,o);return(0,l.kt)("wrapper",(0,a.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"\u4ee5\u4e0b\u662f\u5e38\u89c1\u7684 ",(0,l.kt)("inlineCode",{parentName:"p"},"MonoRepo")," \u4ed3\u5e93\u76ee\u5f55\u7ed3\u6784\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"monorepo-root/    # monorepo \u9879\u76ee\u6839\u76ee\u5f55\n  package.json    # \u516c\u5171\u4f9d\u8d56\n  packages/       # \u6240\u6709\u5b50\u9879\u76ee/\u5b50\u5305\u7684\u5b58\u653e\u76ee\u5f55\n    pkgA/\n      package.json\n    pkgB/\n      package.json\n    ...\n")),(0,l.kt)("p",null,"\u5728\u5f00\u59cb\u4e4b\u524d\uff0c\u5148\u660e\u786e\u4e00\u4e9b\u6982\u5ff5\u63cf\u8ff0\uff0c\u4fdd\u8bc1\u5927\u5bb6\u7406\u89e3\u4e00\u81f4\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"\u516c\u5171\u4f9d\u8d56\uff1a"),"\u6307\u7684\u662f\u9700\u8981\u6dfb\u52a0\u5728\u9879\u76ee\u6839\u76ee\u5f55\u7684 ",(0,l.kt)("inlineCode",{parentName:"li"},"package.json")," \u6587\u4ef6\u5185\u7684\u4f9d\u8d56\uff0c\u4e00\u822c\u5305\u62ec\u6253\u5305\u6784\u5efa\u3001\u4ee3\u7801\u89c4\u8303\u3001\u63d0\u4ea4\u89c4\u8303\u76f8\u5173\u7684\u4f9d\u8d56..."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"\u5b50\u5305/\u5b50\u9879\u76ee\uff1a"),"\u6307\u7684\u662f\u5728 ",(0,l.kt)("inlineCode",{parentName:"li"},"packages")," \u76ee\u5f55\uff08\u6216\u5176\u4ed6\u6307\u5b9a\u5728\u6839\u76ee\u5f55 ",(0,l.kt)("inlineCode",{parentName:"li"},"package.json")," \u4e2d ",(0,l.kt)("inlineCode",{parentName:"li"},"workspaces")," \u5b57\u6bb5\u4e0b\u7684\u76ee\u5f55\uff09\u4e0b\u7684\u5305\uff08\u5982\u4e0a\u9762\u7684 ",(0,l.kt)("inlineCode",{parentName:"li"},"pkgA")," \u548c ",(0,l.kt)("inlineCode",{parentName:"li"},"pkgB"),"\uff09")),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"MonoRepo")," \u9879\u76ee\u7684\u7ba1\u7406\u4e3b\u8981\u5305\u62ec\u4f9d\u8d56\u7ba1\u7406\u548c\u53d1\u5e03\u7ba1\u7406\u4e24\u90e8\u5206\u5185\u5bb9\u3002"),(0,l.kt)("h3",{id:"\u4f9d\u8d56\u7ba1\u7406"},"\u4f9d\u8d56\u7ba1\u7406"),(0,l.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,l.kt)("div",{parentName:"div",className:"admonition-heading"},(0,l.kt)("h5",{parentName:"div"},(0,l.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,l.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,l.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,l.kt)("div",{parentName:"div",className:"admonition-content"},(0,l.kt)("p",{parentName:"div"},"\u4e3a\u4e86\u4fdd\u8bc1\u4f9d\u8d56\u5b89\u88c5\u548c\u7ba1\u7406\u7684\u4e00\u81f4\u6027\uff0c\u6211\u9009\u62e9\u4f7f\u7528 ",(0,l.kt)("inlineCode",{parentName:"p"},"Yarn")," \u8fdb\u884c\u4f9d\u8d56\u7ba1\u7406\u3002\u5982\u679c\u89c9\u5f97 ",(0,l.kt)("inlineCode",{parentName:"p"},"Lerna")," \u7684\u547d\u4ee4\u66f4\u7b80\u4fbf\u53ef\u4ee5\u53bb\u9605\u8bfb\u5176\u6587\u6863\uff0c\u4f46\u662f\u6700\u597d\u4e0d\u8981\u6df7\u7528\uff0c\u907f\u514d\u51fa\u73b0\u5176\u4ed6\u95ee\u9898\u3002"))),(0,l.kt)("h4",{id:"\u4f9d\u8d56\u5b89\u88c5"},"\u4f9d\u8d56\u5b89\u88c5"),(0,l.kt)("p",null,"\u76f4\u63a5\u5728\u9879\u76ee\u6839\u76ee\u5f55\u8fd0\u884c\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"$ yarn\n")),(0,l.kt)("h4",{id:"\u6dfb\u52a0\u79fb\u9664\u4f9d\u8d56"},"\u6dfb\u52a0/\u79fb\u9664\u4f9d\u8d56"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"\u6dfb\u52a0/\u79fb\u9664\u516c\u5171\u4f9d\u8d56\uff0c\u9700\u8981\u6dfb\u52a0 ",(0,l.kt)("inlineCode",{parentName:"li"},"-W")," \u8fd9\u4e2a ",(0,l.kt)("inlineCode",{parentName:"li"},"flag"),"\uff0c\u5982\u679c\u9700\u8981\u6dfb\u52a0 ",(0,l.kt)("inlineCode",{parentName:"li"},"devDependencies"),"\uff0c\u5219\u52a0\u4e0a ",(0,l.kt)("inlineCode",{parentName:"li"},"-D"),"\uff1a")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"$ yarn add/remove <dependency> -W [-D]\n")),(0,l.kt)("ol",{start:2},(0,l.kt)("li",{parentName:"ol"},"\u6dfb\u52a0/\u79fb\u9664\u5b50\u5305\u7684\u4f9d\u8d56\uff0c\u9700\u8981\u4f7f\u7528 ",(0,l.kt)("inlineCode",{parentName:"li"},"yarn workspace")," \u547d\u4ee4\uff1a")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"$ yarn workspace <sub-package-name> add/remove <dependency> [-D]\n")),(0,l.kt)("h4",{id:"\u5c06\u5b50\u5305\u6dfb\u52a0\u4e3a\u4f9d\u8d56"},"\u5c06\u5b50\u5305\u6dfb\u52a0\u4e3a\u4f9d\u8d56"),(0,l.kt)("p",null,"\u5728 ",(0,l.kt)("inlineCode",{parentName:"p"},"MonoRepo")," \u9879\u76ee\u91cc\uff0c\u5176\u4e2d\u4e00\u4e2a\u5b50\u5305\u662f\u5176\u4ed6\u5b50\u5305\u7684\u4f9d\u8d56\u9879\u662f\u975e\u5e38\u5e38\u89c1\u7684\u60c5\u51b5\uff0c\u50cf\u4e0a\u4e00\u8282\u4e00\u6837\uff0c\u901a\u8fc7 ",(0,l.kt)("inlineCode",{parentName:"p"},"yarn workspace")," \u547d\u4ee4\u6dfb\u52a0\uff0c\u4f46\u662f\u9700\u8981\u6ce8\u610f\u7684\u4e00\u70b9\u662f\uff0c\u4f9d\u8d56\u5305\u9700\u8981\u660e\u786e\u6307\u5b9a\u7248\u672c\u53f7\uff0c\u5426\u5219 ",(0,l.kt)("inlineCode",{parentName:"p"},"yarn")," \u4f1a\u4ece\u8fdc\u7a0b\u670d\u52a1\u5668\u62c9\u53d6\u65b0\u7684\u5305\uff0c\u800c\u4e0d\u662f\u4f7f\u7528\u672c\u5730 ",(0,l.kt)("inlineCode",{parentName:"p"},"link")," \u7684\u5b50\u5305\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"# \u5047\u8bbe pkgA \u4f9d\u8d56\u5b50\u5305 pkgB\uff0c\u4e14 pkgB \u6b64\u65f6\u7684\u7248\u672c\u53f7\u4e3a 0.1.1\n$ yarn workspace pkgA add pkgB@0.1.1\n")),(0,l.kt)("h3",{id:"\u53d1\u5e03\u7ba1\u7406"},"\u53d1\u5e03\u7ba1\u7406"),(0,l.kt)("p",null,"TODO"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"$ lerna publish\n")),(0,l.kt)("h3",{id:"\u5176\u4ed6\u5e38\u7528\u547d\u4ee4"},"\u5176\u4ed6\u5e38\u7528\u547d\u4ee4"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"\u521b\u5efa\u65b0\u7684\u5b50\u5305\uff0c\u53ef\u4ee5\u624b\u52a8\u521b\u5efa\u76f8\u5e94\u76ee\u5f55\uff0c\u4e5f\u53ef\u4ee5\u4f7f\u7528 ",(0,l.kt)("inlineCode",{parentName:"li"},"lerna")," \u63d0\u4f9b\u7684\u547d\u4ee4\uff1a")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"$ lerna create <sub-package-name>\n")),(0,l.kt)("ol",{start:2},(0,l.kt)("li",{parentName:"ol"},"\u5f53\u6211\u4eec\u9700\u8981\u8fd0\u884c\u6240\u6709\u5b50\u5305\u7684 ",(0,l.kt)("inlineCode",{parentName:"li"},"script")," \u65f6\uff0c\u53ef\u4ee5\uff1a")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"$ yarn workspaces run <script>\n# \u5982\u679c\u67d0\u4e2a\u5b50\u5305\u4e0d\u5b58\u5728\u8fd9\u4e2a script\uff0cyarn \u4f1a\u62a5\u9519\uff0c\u8fd9\u79cd\u60c5\u51b5\u4e0b\u53ef\u4ee5\u4f7f\u7528 lerna\n$ lerna run <script>\n")),(0,l.kt)("ol",{start:3},(0,l.kt)("li",{parentName:"ol"},"\u6e05\u7406\u6240\u6709\u5b50\u5305\u7684 ",(0,l.kt)("inlineCode",{parentName:"li"},"node_modules"),"\uff1a")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"$ lerna clean\n")),(0,l.kt)("h3",{id:"\u4ee3\u7801\u63d0\u4ea4"},"\u4ee3\u7801\u63d0\u4ea4"),(0,l.kt)("p",null,"\u524d\u671f\u5efa\u8bae\u4f7f\u7528\u4ea4\u4e92\u5f0f\u4ee3\u7801\u63d0\u4ea4\u7684\u65b9\u5f0f\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"$ yarn cz\n")),(0,l.kt)("p",null,"\u7b49\u5230\u719f\u6089\u4ee3\u7801\u63d0\u4ea4\u89c4\u8303\u540e\uff0c\u4e5f\u53ef\u4ee5\u76f4\u63a5\u4f7f\u7528\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},'$ git commit -m "<type>[(scope)]: <subject>"\n')),(0,l.kt)("p",null,"\u63d0\u4ea4\u4fe1\u606f\u4e2d\u7684 ",(0,l.kt)("inlineCode",{parentName:"p"},"type")," \u5b57\u6bb5\u679a\u4e3e\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"- feat: \u65b0\u529f\u80fd\n- fix: bug \u4fee\u590d\n- docs: \u6587\u6863\u66f4\u65b0\n- chore: \u5bf9\u6784\u5efa\u8fc7\u7a0b\u6216\u8f85\u52a9\u5de5\u5177\u548c\u5e93\uff08\u5982\u6587\u6863\u751f\u6210\uff09\u7684\u66f4\u6539\n- init: \u521d\u59cb\u63d0\u4ea4\n- style: \u4fee\u6539\u683c\u5f0f\uff08\u7a7a\u683c\uff0c\u683c\u5f0f\u5316\uff0c\u7701\u7565\u5206\u53f7\u7b49\uff09\uff0c\u5bf9\u4ee3\u7801\u8fd0\u884c\u6ca1\u6709\u5f71\u54cd\n- refactor: \u4ee3\u7801\u91cd\u6784\n- perf: \u6027\u80fd\u4f18\u5316\n- test: \u6dfb\u52a0\u6d4b\u8bd5\n- revert: \u64a4\u9500\u67d0\u4e2a commit\n")),(0,l.kt)("h3",{id:"\u53c2\u8003\u8d44\u6599"},"\u53c2\u8003\u8d44\u6599"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://classic.yarnpkg.com/en/docs/workspaces/"},"yarn workspaces")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://github.com/lerna/lerna"},"lerna")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html"},"Commit message \u548c Change log \u7f16\u5199\u6307\u5357"))))}m.isMDXComponent=!0}}]);