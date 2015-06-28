### CSBUX [Blog](https://csbux.wordpress.com) directives 

### Quick links
- [Dependencies](#dependencies)    
- [Support](#support)    
    - [Need help?](#need-help)
    - [Want to contribute?](#want-to-contribute)



# Dependencies

Obviously, you need AngularJS (I used v1.3.14) and Bootstrap CSS (I used v3.3.2), like for any AngularJS app. The other more specific dependency is AngularUI Bootstrap (for the basic tab directive, I used v0.13.0). You can reference all of these from your favorite CDN (or you can just download them).

Once you have those, head-over to Github and you’ll find the latest release of the minified directive under dist (csbux-vX.Y.Z.min.js).You can also grab the csbux-vX.Y.Z.min.css stylesheet from the same location, in order to get you started quickly with the directive.


When you are done downloading all the dependencies and project files the only remaining part is to add dependencies on the `ui.bootstrap` and `csbux.directives.dts` modules:

```js
angular.module('myModule', ['ui.bootstrap', 'csbux.directives.dts']);
```

## Need help?
Need help using my directives?

Just leave a comment on one of the related articles. E.g. for the Dynamic Tabs directive, you could leave a comment on the first article: [Dynamic Tabs Ep. 1: Once upon a (recent) time…](https://csbux.wordpress.com/2015/06/06/dynamic-tabs-ep-1-once-upon-a-recent-time)

**Please do not create new issues on GitHub to ask questions about using the directives**

## Want to contribute?
Please take a look at [CONTRIBUTING.md](CONTRIBUTING.md).