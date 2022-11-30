<template>
  <div class="app-container">
    <div>
      <el-divider content-position="left">Milestone (ID: {{ milestone.id }})</el-divider>
      <div>
        <span>Title: </span><i>{{ milestone.title }}</i>
      </div>
      <div>
        <span>Progress/Point: </span><i>{{ milestone.progress }}/{{ milestone.point }}</i>
      </div>
      <div>
        <span>Started At: </span><i>{{ milestone.startedAt }}</i>
      </div>
      <div>
        <span>Deadline: </span><i v-if="milestone.deadline">{{ milestone.deadline }}</i><i v-else>-</i>
      </div>
      <div>
        <span>Created At: </span><i>{{ milestone.createdAt }}</i>
      </div>
      <div>
        <span>Updated At: </span><i>{{ milestone.updatedAt }}</i>
      </div>
    </div>

    <br>

    <div class="filter-container">
      <!--      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
      <!--      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">-->
      <!--        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />-->
      <!--      </el-select>-->
      <!--      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">-->
      <!--        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />-->
      <!--      </el-select>-->
      <!--      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">-->
      <!--        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />-->
      <!--      </el-select>-->
      <!--      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">-->
      <!--        Search-->
      <!--      </el-button>-->
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        icon="el-icon-back"
        @click="handleBack"
      >
        Go back
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        Add
      </el-button>
      <!--      <el-button-->
      <!--        :loading="downloadLoading"-->
      <!--        class="filter-item"-->
      <!--        type="primary"-->
      <!--        icon="el-icon-download"-->
      <!--        @click="handleDownload"-->
      <!--      >-->
      <!--        Export-->
      <!--      </el-button>-->
      <!--      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">-->
      <!--        reviewer-->
      <!--      </el-checkbox>-->
    </div>

    <br>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="Content">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="Point" width="110" align="center">
        <template slot-scope="scope">
          <el-tag type="primary">
            {{ scope.row.point }}
          </el-tag>
          <i class="el-icon-coin" />
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.checkedAt?'success':'gray'">{{ scope.row.checkedAt ? 'DONE' : '>>>' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="joinedAt" label="Joined At" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.joinedAt }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="checkedAt" label="Checked At" width="200">
        <template slot-scope="scope">
          <i v-if="scope.row.checkedAt" class="el-icon-time" />
          <span>{{ scope.row.checkedAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="!row.isDeleted" size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-show="total>0"
      :total="total"
      :current-page.sync="listQuery.page"
      :page-size.sync="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10,20,30,50,100]"
      @size-change="fetchData"
      @current-change="fetchData"
    />

    <el-dialog title="Create" :visible.sync="dialog.visible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="right"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="Content" prop="content">
          <el-input v-model="temp.content" />
        </el-form-item>
        <el-form-item label="Point">
          <el-input-number
            v-model="temp.point"
            controls-position="right"
            :min="1"
            :max="500"
            :step="10"
          />
        </el-form-item>
        <el-form-item label="Joined At" prop="joinedAt">
          <el-date-picker v-model="temp.joinedAt" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="Checked At" prop="checkedAt">
          <el-date-picker v-model="temp.checkedAt" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialog.status==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createCheckpoint, deleteById, listCheckpoint, updateById } from '@/api/checkpoint'
import { getMilestoneById } from '@/api/milestone'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listQuery: {
        milestoneId: undefined,
        timestamp: new Date(),
        page: 1,
        pageSize: 10,
        orderBy: '-diff'
      },
      total: 0,
      listLoading: true,
      dialog: {
        status: '',
        visible: false
      },
      temp: undefined,
      milestone: {}
    }
  },
  created() {
    this.listQuery.milestoneId = parseInt(this.$route.params.id)
    this.resetTemp()
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getMilestoneById(this.listQuery.milestoneId).then(res => {
        this.milestone = res.data
      })
      listCheckpoint(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        milestoneId: this.listQuery.milestoneId,
        content: '',
        point: 10,
        joinedAt: new Date(),
        checkedAt: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialog.status = 'create'
      this.dialog.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialog.status = 'update'
      this.dialog.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row, index) {
      deleteById(row.id).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.fetchData()
      })
    },
    handleDetail(row) {
      this.$router.push('/milestoneDetail/' + row.id)
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          if (tempData.checkedAt) {
            tempData.isChecked = true
          }
          updateById(tempData.id, tempData).then(() => {
            this.fetchData()
            this.dialog.visible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleBack() {
      this.$router.push('/milestone')
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createCheckpoint(this.temp).then((res) => {
            this.fetchData()
            this.dialog.visible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
