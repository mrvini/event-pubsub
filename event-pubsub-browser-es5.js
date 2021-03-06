'use strict';

window.EventPubSub=function EventPubSub() {
    this._events_={};
    this.publish=this.trigger=this.emit=emit;
    this.subscribe=this.on=on;
    this.unSubscribe=this.off=off;
    this.emit$=emit$;

    function on(type,handler){
        if(!handler){
            const err=new ReferenceError('handler not defined.');
            throw(err);
        }

        if(!this._events_[type]){
            this._events_[type]=[];
        }

        this._events_[type].push(handler);
        return this;
    }

    function off(type,handler){
        if(!this._events_[type]){
            return this;
        }

        if(!handler){
            var err=new ReferenceError('handler not defined. if you wish to remove all handlers from the event please pass "*" as the handler');
            throw err;
        }

        if(handler=='*'){
            delete this._events_[type];
            return this;
        }

        const handlers=this._events_[type];

        while(handlers.includes(handler)){
            handlers.splice(
                handlers.indexOf(handler),
                1
            );
        }

        if(handlers.length<1){
            delete this._events_[type];
        }

        return this;
    }

    function emit(type){
        this.emit$.apply(this, arguments);
        if(!this._events_[type]){
            return this;
        }

        arguments.splice=Array.prototype.splice;
        arguments.splice(0,1);

        const handlers=this._events_[type];

        for(let handler of handlers){
            handler.apply(this, arguments);
        }

        return this;
    }

    function emit$(type, args){
        if(!this._events_['*']){
            return this;
        }

        const catchAll=this._events_['*'];

        args.shift=Array.prototype.shift;
        args.shift(type);

        for(let handler of catchAll){
            handler.apply(this, args);
        }

        return this;
    }

    return this;
}

if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.includes called on null or undefined');
    }

    var O = Object(this);
    var len = parseInt(O.length, 10) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1], 10) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
        return true;
      }
      k++;
    }
    return false;
  };
}
