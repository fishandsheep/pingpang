Page({
  data: {
    latitude: null,
    longitude: null,
    markers: [],
    scale: 16,
    loading: false
  },

  onLoad() {
    this.getLocation()
  },

  onShow() {
    if (this.data.latitude && this.data.longitude) {
      this.searchNearbyTables()
    }
  },

  getLocation() {
    this.setData({ loading: true })
    
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        this.searchNearbyTables()
      },
      fail: (err) => {
        console.error('获取位置失败:', err)
        wx.showModal({
          title: '提示',
          content: '需要获取您的位置信息来搜索附近的球台',
          showCancel: false
        })
      },
      complete: () => {
        this.setData({ loading: false })
      }
    })
  },

  searchNearbyTables() {
    if (!this.data.latitude || !this.data.longitude) return
    
    this.setData({ loading: true })
    
    // 模拟附近球台数据
    const mockTables = [
      {
        id: 1,
        latitude: this.data.latitude + 0.001,
        longitude: this.data.longitude + 0.001,
        name: '市民活动中心球台',
        address: '市民活动中心1楼',
        distance: '100m',
        status: '空闲'
      },
      {
        id: 2,
        latitude: this.data.latitude - 0.001,
        longitude: this.data.longitude + 0.0005,
        name: '体育公园球台',
        address: '体育公园东侧',
        distance: '200m',
        status: '使用中'
      },
      {
        id: 3,
        latitude: this.data.latitude + 0.0005,
        longitude: this.data.longitude - 0.001,
        name: '社区球台',
        address: '幸福小区内',
        distance: '150m',
        status: '空闲'
      },
      {
        id: 4,
        latitude: this.data.latitude - 0.0008,
        longitude: this.data.longitude - 0.0008,
        name: '体育馆球台',
        address: '市体育馆2楼',
        distance: '180m',
        status: '空闲'
      }
    ]

    const markers = mockTables.map(table => ({
      id: table.id,
      latitude: table.latitude,
      longitude: table.longitude,
      title: table.name,
      subtitle: table.address,
      distance: table.distance,
      status: table.status,
      iconPath: '/assets/table-marker.png',
      width: 32,
      height: 32,
      callout: {
        content: `${table.name}\n${table.address}\n状态: ${table.status}`,
        display: 'BYCLICK'
      }
    }))

    this.setData({ 
      markers,
      loading: false 
    })
    
    wx.showToast({
      title: `找到 ${markers.length} 个球台`,
      icon: 'none',
      duration: 2000
    })
  },

  focusMarker(e) {
    const marker = e.currentTarget.dataset.marker
    this.setData({
      latitude: marker.latitude,
      longitude: marker.longitude,
      scale: 18
    })
  },

  onMarkerTap(e) {
    const markerId = e.markerId
    const marker = this.data.markers.find(m => m.id === markerId)
    if (marker) {
      console.log('点击了标记:', marker.title)
    }
  },

  onRegionChange(e) {
    if (e.type === 'end') {
      // 地图移动结束后可以重新搜索
    }
  },

  toggleFilter() {
    wx.showActionSheet({
      itemList: ['全部球台', '仅显示空闲', '仅显示使用中'],
      success: (res) => {
        console.log('选择了筛选:', res.tapIndex)
        // 这里可以添加筛选逻辑
      }
    })
  }
})