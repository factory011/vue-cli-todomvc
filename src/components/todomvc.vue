<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        v-model="addLabel"
        @keyup.enter="doneAdd()"
        placeholder="What needs to be done?"
        autofocus
      >
    </header>
    <section class="main">
      <input id="toggle-all" class="toggle-all" type="checkbox">
      <label for="toggle-all" @click="selectAll()">Mark all as complete</label>
      <ul class="todo-list">
        <li
          :class="{completed: item.completed, editing: item.isEditing}"
          v-for="item in todo"
          :key="item.id"
        >
          <div class="view">
            <input class="toggle" type="checkbox" v-model="item.completed">
            <label @dblclick="edit(item)">{{item.title}}</label>
            <button class="destroy" @click="doneDelete(item)" :key="item.id"></button>
          </div>
          <input
            class="edit"
            v-model="item.title"
            v-todo-focus="true"
            @blur.prevent="doneEdit(item)"
            @keyup.enter="doneEdit(item)"
            @keyup.esc="cancelEdit(item)"
          >
        </li>
      </ul>
    </section>
    <footer class="footer">
      <span class="todo-count">
        <strong>{{num}}</strong> item left
      </span>
      <button class="clear-completed" @click="clearDone()">Clear completed</button>
    </footer>
  </section>
</template>

<script>
export default {
  data () {
    // 数据集合
    let queryList = []
    // 判断是否有本地数据，有就读取本地的
    if (localStorage.getItem('todo')) {
      queryList = JSON.parse(localStorage.getItem('todo'))
    }
    // 未完成的数量
    let num = 0
    queryList.forEach(item => {
      if (!item.completed) {
        num++
      }
    })
    return {
      todo: queryList,
      addLabel: '',
      num: num,
      selectStatus: false
    }
  },
  methods: {
    /**
     * 编辑
     */
    edit (item) {
      this.todo.forEach(res => {
        if (res.id === item.id) {
          res = item
        }
      })
      item.isEditing = true
    },
    /**
     * 编辑完成
     */
    doneEdit (item) {
      localStorage.setItem('todo', JSON.stringify(this.todo))
      item.isEditing = false
    },
    /**
     * 取消编辑
     */
    cancelEdit (item) {
      item.isEditing = false
    },
    /**
     * 添加
     */
    doneAdd () {
      let lastId = 0
      if (this.todo.length === 0) {
        lastId = 1
      } else {
        lastId = this.todo[0].id + 1
      }
      if (this.addLabel.length > 0) {
        this.todo.unshift({
          id: lastId,
          title: this.addLabel,
          completed: false,
          isEditing: false
        })
        this.addLabel = ''
        localStorage.setItem('todo', JSON.stringify(this.todo))
      }
    },
    /**
     * 删除
     */
    doneDelete (item) {
      let arr = this.todo.filter(val => {
        return val.id !== item.id
      })
      this.todo = arr
      localStorage.setItem('todo', JSON.stringify(this.todo))
    },
    /**
     * 全选
     */
    selectAll () {
      if (this.selectStatus) {
        this.todo.forEach(item => {
          item.completed = false
        })
        this.selectStatus = false
      } else {
        this.todo.forEach(item => {
          item.completed = true
        })
        this.selectStatus = true
      }
    },
    /**
     * 清除已完成
     */
    clearDone () {
      let arr = this.todo.filter(item => {
        return !item.completed
      })
      this.todo = arr
      localStorage.setItem('todo', JSON.stringify(this.todo))
    }
  },
  /**
   * 自定义，input双击后聚焦
   */
  directives: {
    'todo-focus': function (el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  },
  /**
   * 监听数据变化
   */
  watch: {
    todo: {
      handler () {
        localStorage.setItem('todo', JSON.stringify(this.todo))
        this.num = 0
        this.todo.forEach(item => {
          if (!item.completed) {
            this.num++
          }
        })
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped>
.todo-list li.editing .edit {
  display: block;
  width: 506px;
  padding: 12px 16px;
  margin: 0 0 0 43px;
}
</style>
