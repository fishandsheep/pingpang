Page({
  data: {
    latitude: null,
    longitude: null,
    markers: [],
    allMarkers: [], // 保存所有球台数据
    scale: 16,
    loading: false,
    mapExpanded: false,
    panelState: '',
    currentPanelState: '',
    dragStartY: 0,
    hasShownTips: false,
    filterStatus: 'all' // 筛选状态: all, free, busy
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
        wx.hideLoading()
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
      },
      {
        id: 5,
        latitude: this.data.latitude + 0.002,
        longitude: this.data.longitude - 0.0005,
        name: '学校球台',
        address: '市一中体育馆',
        distance: '250m',
        status: '使用中'
      },
      {
        id: 6,
        latitude: this.data.latitude - 0.0015,
        longitude: this.data.longitude + 0.001,
        name: '公园球台',
        address: '中央公园',
        distance: '300m',
        status: '空闲'
      }
    ]

    const allMarkers = mockTables.map(table => ({
      id: table.id,
      latitude: table.latitude,
      longitude: table.longitude,
      title: table.name,
      subtitle: table.address,
      distance: table.distance,
      status: table.status,
      iconPath: '/assets/table-marker.svg',
      width: 32,
      height: 32,
      callout: {
        content: `${table.name}\n${table.address}\n状态: ${table.status}`,
        display: 'BYCLICK'
      }
    }))

    // 应用当前筛选条件
    const filteredMarkers = this.applyFilter(allMarkers)
    
    this.setData({ 
      allMarkers,
      markers: filteredMarkers,
      loading: false 
    })
    
    wx.hideLoading()
    wx.showToast({
      title: `找到 ${filteredMarkers.length} 个球台`,
      icon: 'none',
      duration: 2000
    })
  },

  focusMarker(e) {
    const marker = e.currentTarget.dataset.marker
    
    // 保持半屏地图，只更新地图中心点
    this.setData({
      latitude: marker.latitude,
      longitude: marker.longitude,
      scale: 17,
      mapExpanded: false,
      panelState: ''
    })
    
    // 显示球台信息
    wx.showToast({
      title: `已定位到 ${marker.title}`,
      icon: 'none',
      duration: 1500
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

  onSearchTap() {
    wx.showModal({
      title: '搜索',
      content: '搜索功能开发中，敬请期待',
      showCancel: false,
      confirmText: '确定'
    })
  },

  toggleFilter() {
    wx.showActionSheet({
      itemList: ['全部球台', '仅显示空闲', '仅显示使用中'],
      success: (res) => {
        const filterTypes = ['all', 'free', 'busy']
        const filterNames = ['全部球台', '仅显示空闲', '仅显示使用中']
        const selectedFilter = filterTypes[res.tapIndex]
        
        this.setData({
          filterStatus: selectedFilter
        })
        
        // 应用筛选
        const filteredMarkers = this.applyFilter(this.data.allMarkers)
        this.setData({ markers: filteredMarkers })
        
        wx.showToast({
          title: `筛选: ${filterNames[res.tapIndex]} (${filteredMarkers.length}个)`,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  applyFilter(markers) {
    const { filterStatus } = this.data
    
    if (filterStatus === 'all') {
      return markers
    } else if (filterStatus === 'free') {
      return markers.filter(marker => marker.status === '空闲')
    } else if (filterStatus === 'busy') {
      return markers.filter(marker => marker.status === '使用中')
    }
    
    return markers
  },

  onLocationTap() {
    wx.showLoading({ title: '获取位置中...' })
    this.getLocation()
  },

  onRefreshTap() {
    wx.showLoading({ title: '刷新中...' })
    this.searchNearbyTables()
  },

  onDragStart(e) {
    this.setData({
      dragStartY: e.touches[0].clientY,
      currentPanelState: this.data.panelState
    })
  },

  onDragMove(e) {
    const deltaY = e.touches[0].clientY - this.data.dragStartY
    // 实时更新面板位置以提供视觉反馈
    if (Math.abs(deltaY) > 10) {
      // 防止过于敏感的拖拽
      if (deltaY > 0 && this.data.currentPanelState !== 'collapsed') {
        // 向下滑动，准备收缩
        this.setData({ panelState: 'collapsed', mapExpanded: true })
      } else if (deltaY < 0 && this.data.currentPanelState === 'collapsed') {
        // 向上滑动，准备展开
        this.setData({ panelState: '', mapExpanded: false })
      }
    }
  },

  onDragEnd(e) {
    const deltaY = e.changedTouches[0].clientY - this.data.dragStartY
    const threshold = 50 // 增加阈值，防止误触
    
    if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        // 向下滑动，面板收缩，地图扩展
        this.setData({
          mapExpanded: true,
          panelState: 'collapsed'
        })
        wx.showToast({
          title: '地图已展开',
          icon: 'none',
          duration: 1000
        })
      } else {
        // 向上滑动，面板展开，地图收缩
        this.setData({
          mapExpanded: false,
          panelState: ''
        })
        wx.showToast({
          title: '面板已展开',
          icon: 'none',
          duration: 1000
        })
      }
    } else {
      // 拖拽距离不够，恢复原状态
      this.setData({
        panelState: this.data.currentPanelState,
        mapExpanded: this.data.currentPanelState === 'collapsed'
      })
    }
  },

  resetPanel() {
    this.setData({
      mapExpanded: false,
      panelState: ''
    })
  },

  getFilterText(filterStatus) {
    switch(filterStatus) {
      case 'all':
        return '全部'
      case 'free':
        return '空闲'
      case 'busy':
        return '使用中'
      default:
        return '筛选'
    }
  },

  onShow() {
    if (this.data.latitude && this.data.longitude) {
      this.searchNearbyTables()
    }
    
    // 显示使用提示
    if (!this.data.hasShownTips) {
      setTimeout(() => {
        wx.showModal({
          title: '使用提示',
          content: '• 点击球台可定位到地图中央\n• 拖拽面板顶部可调整地图大小\n• 点击地图空白区域可恢复默认视图\n• 点击筛选按钮可按状态筛选球台',
          showCancel: false,
          confirmText: '知道了',
          success: () => {
            this.setData({ hasShownTips: true })
          }
        })
      }, 1000)
    }
  }
})