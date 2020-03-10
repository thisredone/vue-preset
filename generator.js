fs = require('fs');


const vueConfig = `\
module.exports = {
  configureWebpack: {
    entry: { app: './src/main.coffee' },
    resolve: {
      extensions: ['.coffee']
    },
    module: {
      rules: [
        {
          test: /\.coffee$/,
          use: [
            { loader: 'coffee-loader', options: { transpile: { plugins: ['macros'] } }}
          ]
        }
      ]
    },
    devServer: {
      disableHostCheck: true
    }
  }
}
`

const appVue = `\
<template>
  <div id="app" class="subpixel-antialiased">
    Hi
  </div>
</template>

<script lang="coffee">
import { it } from 'param.macro'

export default
  name: 'App'
</script>

<style lang="stylus">
</style>
`

const mainCoffee = `\
import { it } from 'param.macro'
import './global_extensions'
import Vue from 'vue'
import App from './App.vue'
import './assets/tailwind.css'

Vue.config.productionTip = false

new Vue(render: (h) -> h(App)).$mount('#app')
`

const globals = `\
Object.assign global,
  log: console.log.bind(console)
`

module.exports = (api) => {
  api.onCreateComplete(() => {
    fs.unlinkSync(api.resolve('src', 'assets', 'logo.png'));
    fs.unlinkSync(api.resolve('src', 'components', 'HelloWorld.vue'));
    fs.unlinkSync(api.resolve('src', 'main.js'));
    fs.unlinkSync(api.resolve('public', 'favicon.ico'));
    fs.rmdirSync(api.resolve('src', 'components'));
    fs.writeFileSync(api.resolve('vue.config.js'), vueConfig);
    fs.writeFileSync(api.resolve('src', 'App.vue'), appVue);
    fs.writeFileSync(api.resolve('src', 'main.coffee'), mainCoffee);
    fs.writeFileSync(api.resolve('src', 'README.md'), '');
    fs.writeFileSync(api.resolve('src', 'global_extensions.coffee'), globals);
  })

  api.extendPackage({
    scripts: {
      dev: 'vue-cli-service serve'
    },
    devDependencies: {
      coffeescript: '^2.5.1',
      'coffee-loader': 'github:thisredone/coffee-loader',
      'babel-plugin-macros': '^2.8.0',
      'param.macro': '^3.2.1'
    }
  });
};
