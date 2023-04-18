var x = new XMLHttpRequest

x.open("post", "https://chan.sankakucomplex.com/favorite/create.json")



Favorite = {
  link_to_users: function(users) {
    var split_users = users.split(/,/)
    var html = ""
    
    if ((split_users.size() == 1) && (split_users[0] == "")) {
      return "no one"
    } else {
       html = split_users.slice(0, 6).map(function(x) {return '<a href="/user/show?name=' + encodeURIComponent(x) + '">' + x + '</a>'}).join(", ")
      
      if (split_users.size() > 6) {
        html += '<span id="remaining-favs" style="display: none;">' + split_users.slice(6, -1).map(function(x) {return '<a href="/user/show?name=' + encodeURIComponent(x) + '">' + x + '</a>'}).join(", ") + '</span> <span id="remaining-favs-link">(<a href="#" onclick="$(\'remaining-favs\').show(); $(\'remaining-favs-link\').hide(); return false;">' + (split_users.size() - 6) + ' more</a>)</span>'
      }
      
      return html
    }
  },

  create: function(post_id) {
    alert('Adding post #' + post_id)

    new Ajax.Request('/favorite/create.json', {
      parameters: {
        id: post_id
      },
      onComplete: function(resp) {
        var resp = resp.responseJSON

        if (resp.success) {
          alert("Post #" + post_id + " added to favorites")
          
        } else {
          alert("Error: " + resp.reason)
        }
      }
    })
  },

  destroy: function(post_id) {
    alert('Removing post #' + post_id)

    new Ajax.Request('/favorite/destroy.json', {
      parameters: {
        id: post_id
      },
      onComplete: function(resp) {
        var resp = resp.responseJSON
        alert("Post #" + post_id + " removed from your favorites")
    
      }
    })
  }
}

var Ajax = {
    getTransport: function() {
      return Try.these(
        function() {return new XMLHttpRequest()},
        function() {return new ActiveXObject('Msxml2.XMLHTTP')},
        function() {return new ActiveXObject('Microsoft.XMLHTTP')}
      ) || false;
    },
  
    activeRequestCount: 0
  };
  
  Ajax.Responders = {
    responders: [],
  
    _each: function(iterator) {
      this.responders._each(iterator);
    },
  
    dispatch: function(callback, request, transport, json) {
      this.each(function(responder) {
        if (Object.isFunction(responder[callback])) {
          try {
            responder[callback].apply(responder, [request, transport, json]);
          } catch (e) { }
        }
      });
    }
  };
  
  // Object.extend(Ajax.Responders, Enumerable);

  Ajax.Base = Class.create({
    initialize: function(options) {
      this.options = {
        method:       'post',
        asynchronous: true,
        contentType:  'application/x-www-form-urlencoded',
        encoding:     'UTF-8',
        parameters:   '',
        evalJSON:     true,
        evalJS:       true
      };
      Object.extend(this.options, options || { });
  
      this.options.method = this.options.method.toLowerCase();
  
      if (Object.isString(this.options.parameters))
        this.options.parameters = this.options.parameters.toQueryParams();
      else if (Object.isHash(this.options.parameters))
        this.options.parameters = this.options.parameters.toObject();
    }
  });
  
  Ajax.Request = Class.create(Ajax.Base, {
    _complete: false,
  
    initialize: function($super, url, options) {
      $super(options);
      this.transport = Ajax.getTransport();
      this.request(url);
    },
  
    request: function(url) {
      this.url = url;
      this.method = this.options.method;
      var params = Object.clone(this.options.parameters);
  
      if (!['get', 'post'].include(this.method)) {
        // simulate other verbs over post
        params['_method'] = this.method;
        this.method = 'post';
      }
  
      this.parameters = params;
  
      if (params = Object.toQueryString(params)) {
        // when GET, append parameters to URL
        if (this.method == 'get')
          this.url += (this.url.include('?') ? '&' : '?') + params;
        else if (/Konqueror|Safari|KHTML/.test(navigator.userAgent))
          params += '&_=';
      }
  
      try {
        var response = new Ajax.Response(this);
        if (this.options.onCreate) this.options.onCreate(response);
        Ajax.Responders.dispatch('onCreate', this, response);
  
        this.transport.open(this.method.toUpperCase(), this.url,
          this.options.asynchronous);
  
        if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);
  
        this.transport.onreadystatechange = this.onStateChange.bind(this);
        this.setRequestHeaders();
  
        this.body = this.method == 'post' ? (this.options.postBody || params) : null;
        this.transport.send(this.body);
  
        /* Force Firefox to handle ready state 4 for synchronous requests */
        if (!this.options.asynchronous && this.transport.overrideMimeType)
          this.onStateChange();
  
      }
      catch (e) {
        this.dispatchException(e);
      }
    },
  
    onStateChange: function() {
      var readyState = this.transport.readyState;
      if (readyState > 1 && !((readyState == 4) && this._complete))
        this.respondToReadyState(this.transport.readyState);
    },
  
    setRequestHeaders: function() {
      var headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'X-Prototype-Version': Prototype.Version,
        'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
      };
  
      if (this.method == 'post') {
        headers['Content-type'] = this.options.contentType +
          (this.options.encoding ? '; charset=' + this.options.encoding : '');
  
        /* Force "Connection: close" for older Mozilla browsers to work
         * around a bug where XMLHttpRequest sends an incorrect
         * Content-length header. See Mozilla Bugzilla #246651.
         */
        if (this.transport.overrideMimeType &&
            (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0,2005])[1] < 2005)
              headers['Connection'] = 'close';
      }
  
      // user-defined headers
      if (typeof this.options.requestHeaders == 'object') {
        var extras = this.options.requestHeaders;
  
        if (Object.isFunction(extras.push))
          for (var i = 0, length = extras.length; i < length; i += 2)
            headers[extras[i]] = extras[i+1];
        else
          $H(extras).each(function(pair) { headers[pair.key] = pair.value });
      }
  
      for (var name in headers)
        this.transport.setRequestHeader(name, headers[name]);
    },
  
    success: function() {
      var status = this.getStatus();
      return !status || (status >= 200 && status < 300);
    },
  
    getStatus: function() {
      try {
        return this.transport.status || 0;
      } catch (e) { return 0 }
    },
  
    respondToReadyState: function(readyState) {
      var state = Ajax.Request.Events[readyState], response = new Ajax.Response(this);
  
      if (state == 'Complete') {
        try {
          this._complete = true;
          (this.options['on' + response.status]
           || this.options['on' + (this.success() ? 'Success' : 'Failure')]
           || Prototype.emptyFunction)(response, response.headerJSON);
        } catch (e) {
          this.dispatchException(e);
        }
  
        var contentType = response.getHeader('Content-type');
        if (this.options.evalJS == 'force'
            || (this.options.evalJS && this.isSameOrigin() && contentType
            && contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
          this.evalResponse();
      }
  
      try {
        (this.options['on' + state] || Prototype.emptyFunction)(response, response.headerJSON);
        Ajax.Responders.dispatch('on' + state, this, response, response.headerJSON);
      } catch (e) {
        this.dispatchException(e);
      }
  
      if (state == 'Complete') {
        // avoid memory leak in MSIE: clean up
        this.transport.onreadystatechange = Prototype.emptyFunction;
      }
    },
  
    isSameOrigin: function() {
      var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
      return !m || (m[0] == '#{protocol}//#{domain}#{port}'.interpolate({
        protocol: location.protocol,
        domain: document.domain,
        port: location.port ? ':' + location.port : ''
      }));
    },
  
    getHeader: function(name) {
      try {
        return this.transport.getResponseHeader(name) || null;
      } catch (e) { return null }
    },
  
    evalResponse: function() {
      try {
        return eval((this.transport.responseText || '').unfilterJSON());
      } catch (e) {
        this.dispatchException(e);
      }
    },
  
    dispatchException: function(exception) {
      (this.options.onException || Prototype.emptyFunction)(this, exception);
      Ajax.Responders.dispatch('onException', this, exception);
    }
  });
  
  Ajax.Request.Events =
    ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];
  
  Ajax.Response = Class.create({
    initialize: function(request){
      this.request = request;
      var transport  = this.transport  = request.transport,
          readyState = this.readyState = transport.readyState;
  
      if((readyState > 2 && !Prototype.Browser.IE) || readyState == 4) {
        this.status       = this.getStatus();
        this.statusText   = this.getStatusText();
        this.responseText = String.interpret(transport.responseText);
        this.headerJSON   = this._getHeaderJSON();
      }
  
      if(readyState == 4) {
        var xml = transport.responseXML;
        this.responseXML  = Object.isUndefined(xml) ? null : xml;
        this.responseJSON = this._getResponseJSON();
      }
    },
  
    status:      0,
    statusText: '',
  
    getStatus: Ajax.Request.prototype.getStatus,
  
    getStatusText: function() {
      try {
        return this.transport.statusText || '';
      } catch (e) { return '' }
    },
  
    getHeader: Ajax.Request.prototype.getHeader,
  
    getAllHeaders: function() {
      try {
        return this.getAllResponseHeaders();
      } catch (e) { return null }
    },
  
    getResponseHeader: function(name) {
      return this.transport.getResponseHeader(name);
    },
  
    getAllResponseHeaders: function() {
      return this.transport.getAllResponseHeaders();
    },
  
    _getHeaderJSON: function() {
      var json = this.getHeader('X-JSON');
      if (!json) return null;
      json = decodeURIComponent(escape(json));
      try {
        return json.evalJSON(this.request.options.sanitizeJSON ||
          !this.request.isSameOrigin());
      } catch (e) {
        this.request.dispatchException(e);
      }
    },
  
    _getResponseJSON: function() {
      var options = this.request.options;
      if (!options.evalJSON || (options.evalJSON != 'force' &&
        !(this.getHeader('Content-type') || '').include('application/json')) ||
          this.responseText.blank())
            return null;
      try {
        return this.responseText.evalJSON(options.sanitizeJSON ||
          !this.request.isSameOrigin());
      } catch (e) {
        this.request.dispatchException(e);
      }
    }
  });
  
  Ajax.Updater = Class.create(Ajax.Request, {
    initialize: function($super, container, url, options) {
      this.container = {
        success: (container.success || container),
        failure: (container.failure || (container.success ? null : container))
      };
  
      options = Object.clone(options);
      var onComplete = options.onComplete;
      options.onComplete = (function(response, json) {
        this.updateContent(response.responseText);
        if (Object.isFunction(onComplete)) onComplete(response, json);
      }).bind(this);
  
      $super(url, options);
    },
  
    updateContent: function(responseText) {
      var receiver = this.container[this.success() ? 'success' : 'failure'],
          options = this.options;
  
      if (!options.evalScripts) responseText = responseText.stripScripts();
  
      if (receiver = $(receiver)) {
        if (options.insertion) {
          if (Object.isString(options.insertion)) {
            var insertion = { }; insertion[options.insertion] = responseText;
            receiver.insert(insertion);
          }
          else options.insertion(receiver, responseText);
        }
        else receiver.update(responseText);
      }
    }
  });
  
  Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
    initialize: function($super, container, url, options) {
      $super(options);
      this.onComplete = this.options.onComplete;
  
      this.frequency = (this.options.frequency || 2);
      this.decay = (this.options.decay || 1);
  
      this.updater = { };
      this.container = container;
      this.url = url;
  
      this.start();
    },
  
    start: function() {
      this.options.onComplete = this.updateComplete.bind(this);
      this.onTimerEvent();
    },
  
    stop: function() {
      this.updater.options.onComplete = undefined;
      clearTimeout(this.timer);
      (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
    },
  
    updateComplete: function(response) {
      if (this.options.decay) {
        this.decay = (response.responseText == this.lastText ?
          this.decay * this.options.decay : 1);
  
        this.lastText = response.responseText;
      }
      this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency);
    },
  
    onTimerEvent: function() {
      this.updater = new Ajax.Updater(this.container, this.url, this.options);
    }
  });

  var Enumerable = {
    each: function(iterator, context) {
      var index = 0;
      try {
        this._each(function(value) {
          iterator.call(context, value, index++);
        });
      } catch (e) {
        if (e != $break) throw e;
      }
      return this;
    },
  
    eachSlice: function(number, iterator, context) {
      var index = -number, slices = [], array = this.toArray();
      if (number < 1) return array;
      while ((index += number) < array.length)
        slices.push(array.slice(index, index+number));
      return slices.collect(iterator, context);
    },
  
    all: function(iterator, context) {
      iterator = iterator || Prototype.K;
      var result = true;
      this.each(function(value, index) {
        result = result && !!iterator.call(context, value, index);
        if (!result) throw $break;
      });
      return result;
    },
  
    any: function(iterator, context) {
      iterator = iterator || Prototype.K;
      var result = false;
      this.each(function(value, index) {
        if (result = !!iterator.call(context, value, index))
          throw $break;
      });
      return result;
    },
  
    collect: function(iterator, context) {
      iterator = iterator || Prototype.K;
      var results = [];
      this.each(function(value, index) {
        results.push(iterator.call(context, value, index));
      });
      return results;
    },
  
    detect: function(iterator, context) {
      var result;
      this.each(function(value, index) {
        if (iterator.call(context, value, index)) {
          result = value;
          throw $break;
        }
      });
      return result;
    },
  
    findAll: function(iterator, context) {
      var results = [];
      this.each(function(value, index) {
        if (iterator.call(context, value, index))
          results.push(value);
      });
      return results;
    },
  
    grep: function(filter, iterator, context) {
      iterator = iterator || Prototype.K;
      var results = [];
  
      if (Object.isString(filter))
        filter = new RegExp(filter);
  
      this.each(function(value, index) {
        if (filter.match(value))
          results.push(iterator.call(context, value, index));
      });
      return results;
    },
  
    include: function(object) {
      if (Object.isFunction(this.indexOf))
        if (this.indexOf(object) != -1) return true;
  
      var found = false;
      this.each(function(value) {
        if (value == object) {
          found = true;
          throw $break;
        }
      });
      return found;
    },
  
    inGroupsOf: function(number, fillWith) {
      fillWith = Object.isUndefined(fillWith) ? null : fillWith;
      return this.eachSlice(number, function(slice) {
        while(slice.length < number) slice.push(fillWith);
        return slice;
      });
    },
  
    inject: function(memo, iterator, context) {
      this.each(function(value, index) {
        memo = iterator.call(context, memo, value, index);
      });
      return memo;
    },
  
    invoke: function(method) {
      var args = $A(arguments).slice(1);
      return this.map(function(value) {
        return value[method].apply(value, args);
      });
    },
  
    max: function(iterator, context) {
      iterator = iterator || Prototype.K;
      var result;
      this.each(function(value, index) {
        value = iterator.call(context, value, index);
        if (result == null || value >= result)
          result = value;
      });
      return result;
    },
  
    min: function(iterator, context) {
      iterator = iterator || Prototype.K;
      var result;
      this.each(function(value, index) {
        value = iterator.call(context, value, index);
        if (result == null || value < result)
          result = value;
      });
      return result;
    },
  
    partition: function(iterator, context) {
      iterator = iterator || Prototype.K;
      var trues = [], falses = [];
      this.each(function(value, index) {
        (iterator.call(context, value, index) ?
          trues : falses).push(value);
      });
      return [trues, falses];
    },
  
    pluck: function(property) {
      var results = [];
      this.each(function(value) {
        results.push(value[property]);
      });
      return results;
    },
  
    reject: function(iterator, context) {
      var results = [];
      this.each(function(value, index) {
        if (!iterator.call(context, value, index))
          results.push(value);
      });
      return results;
    },
  
    sortBy: function(iterator, context) {
      return this.map(function(value, index) {
        return {
          value: value,
          criteria: iterator.call(context, value, index)
        };
      }).sort(function(left, right) {
        var a = left.criteria, b = right.criteria;
        return a < b ? -1 : a > b ? 1 : 0;
      }).pluck('value');
    },
  
    toArray: function() {
      return this.map();
    },
  
    zip: function() {
      var iterator = Prototype.K, args = $A(arguments);
      if (Object.isFunction(args.last()))
        iterator = args.pop();
  
      var collections = [this].concat(args).map($A);
      return this.map(function(value, index) {
        return iterator(collections.pluck(index));
      });
    },
  
    size: function() {
      return this.toArray().length;
    },
  
    inspect: function() {
      return '#<Enumerable:' + this.toArray().inspect() + '>';
    }
  };