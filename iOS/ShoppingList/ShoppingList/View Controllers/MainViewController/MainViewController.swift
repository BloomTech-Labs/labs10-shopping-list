//
//  MainViewController.swift
//  Shopping List
//
//  Created by Jason Modisett on 2/14/19.
//  Copyright © 2019 Jason Modisett. All rights reserved.
//

import UIKit
import Auth0
import PushNotifications

enum GroupView { case list, history, stats }

class MainViewController: UIViewController, StoryboardInstantiatable, PopoverViewDelegate {
    var pusher: PushNotifications!
    
    static let storyboardName: StoryboardName = "MainViewController"
    var noItemsView: NoItemsView!
    @IBOutlet weak var groupName: UILabel!
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var addNewItemContainer: UIView!
    @IBOutlet weak var checkoutContainer: UIView!
    @IBOutlet weak var segmentedControl: UISegmentedControl!
    
    
    var currentView: GroupView = .list { didSet { updatesNeeded() }}
    
    // MARK: - Lifecycle methods
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        noItemsView = NoItemsView.instantiate()
        noItemsView.frame = tableView.frame
        view.insertSubview(noItemsView, aboveSubview: tableView)
        
        tableView.contentInset = UIEdgeInsets(top: 10, left: 0, bottom: 0, right: 0)
        tableView.rowHeight = 90
        tableView.tableFooterView = UIView()
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "ReuseIdentifier")
        tableView.register(UINib(nibName: "ItemTableViewCell", bundle: nil), forCellReuseIdentifier: "ItemCell")
        tableView.register(UINib(nibName: "HistoryTableViewCell", bundle: nil), forCellReuseIdentifier: "HistoryCell")
        
        GroupController.shared.getUserID { (user) in
            
            guard let id = user?.profile.id,
                  let name = user?.profile.name else {
                    return }
            userID = id
            userName = name
            
            guard let pusher = self.pusher else {
                return
                
            }
            
            GroupController.shared.getGroups(forUserID: userID, pusher: pusher) { (success) in
                if allGroups.count > 0 {
                    selectedGroup = allGroups[0]
                    UI { self.updatesNeeded() }
                }
            }
        }
    }
    
    @IBAction func segmentControlSwitched(_ sender: UISegmentedControl) {
        switch sender.selectedSegmentIndex {
        case 0:
            currentView = .list
        case 1:
            currentView = .history
        case 2:
            currentView = .stats
        default:
            currentView = .list
        }
    }
    
    
    
    func updatesNeeded() {
        noItemsView.alpha = 0
        noItemsView.groupView = currentView
        checkoutContainer.alpha = 0
        
        switch currentView {
        case .list:
            ItemController.shared.loadItems { (_) in
                UI {
                    self.tableView.rowHeight = 90
                    self.addNewItemContainer.alpha = 1
                    self.tableView.reloadData()
                }
            }
        case .history:
            ItemController.shared.loadItems { (_) in
                HistoryController().getHistory { (_) in
                    UI {
                        self.tableView.rowHeight = 120
                        self.addNewItemContainer.alpha = 0
                        self.tableView.reloadData()
                    }
                }
            }
        case .stats:
            GroupMemberController().getGroupMembers { (_) in
                UI {
                    self.addNewItemContainer.alpha = 0
                    self.tableView.reloadData()
                }
            }
        }
        
        guard let selectedGroup = selectedGroup else { return }
        selectedItems = []
        groupName.text = selectedGroup.name
    }
    
    
    // MARK: - IBActions
    
    @IBAction func addNewItemButtonPressed(_ sender: Any) {
        Popovers.triggerNewItemPopover(self)
    }
    
    @IBAction func checkoutButtonPressed(_ sender: Any) {
        Popovers.triggerCheckoutPopover(delegate: self, items: selectedItems)
    }
    
    
    @IBAction func showGroupsButtonPressed(_ sender: Any) {
        Popovers.triggerGroupsPopover(self)
    }
    
    @IBAction func settingsButtonPressed(_ sender: Any) {
        let storyboard = UIStoryboard(name: "SettingsTableViewController", bundle: nil)
        let settingsVC = storyboard.instantiateInitialViewController() ?? SettingsTableViewController.instantiate()
        present(settingsVC, animated: true, completion: nil)
    }
}


extension MainViewController: UITableViewDataSource, UITableViewDelegate {
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        switch currentView {
        case .list:
            noItemsView.alpha = (selectedGroup?.items?.count ?? 0) == 0 ? 1 : 0
            return selectedGroup?.items?.count ?? 0
        case .history:
            noItemsView.alpha = history.count == 0 ? 1 : 0
            return history.count
        case .stats:
            noItemsView.alpha = groupMembers.count == 0 ? 1 : 0
            return groupMembers.count
        }
        
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "ReuseIdentifier", for: indexPath)
        guard let itemCell = tableView.dequeueReusableCell(withIdentifier: "ItemCell", for: indexPath) as? ItemTableViewCell,
              let historyCell = tableView.dequeueReusableCell(withIdentifier: "HistoryCell", for: indexPath) as? HistoryTableViewCell else { return cell }
        itemCell.tintColor = UIColor(named: "Theme")
        itemCell.accessoryType = .none
        historyCell.accessoryType = .none
        cell.tintColor = UIColor(named: "Theme")
        cell.textLabel?.numberOfLines = 0
        cell.accessoryType = .none
        guard let selectedGroup = selectedGroup else { return cell }
        
        switch currentView {
        case .list:
            guard let item = selectedGroup.items?[indexPath.row] else { return cell }
            itemCell.accessoryType = selectedItems.contains(item) ? .checkmark : .none
            itemCell.itemLabel.text = item.name
            return itemCell
        case .history:
            let item = history[indexPath.row]
            let itemName = item.name ?? ""
            let itemUser = item.user ?? ""
            let total = item.total?.toCurrency() ?? ""
            historyCell.itemLabel.text = itemName
            historyCell.nameLabel.text = itemUser.uppercased()
            historyCell.priceLabel.text = total
            return historyCell
        case .stats:
            let groupMember = groupMembers[indexPath.row]
            let total = groupMember.total.toCurrency()
            let net = groupMember.net.toCurrency()
            cell.textLabel?.text = "Total: \(total)\nNet: \(net)"
            return cell
        }
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        guard let cell = tableView.cellForRow(at: indexPath) else { return }
        cellSelected(cell: cell, indexPath: indexPath)
    }
    
    func tableView(_ tableView: UITableView, editActionsForRowAt indexPath: IndexPath) -> [UITableViewRowAction]? {
        
        let delete = UITableViewRowAction(style: .destructive, title: "Delete") { (action, indexPath) in
            guard let selectedGroup = selectedGroup else { return }
            guard let item = selectedGroup.items?[indexPath.row] else { return }
            ItemController.shared.deleteItem(id: item.id ?? 0) {(_) in }
            if selectedItems.contains(item) {
                let index = selectedItems.index(of: item) ?? 0
                selectedItems.remove(at: index)
            }
            selectedGroup.items?.remove(at: indexPath.row)
            self.tableView.deleteRows(at: [indexPath], with: .automatic)
        }
        
        return currentView == .list ? [delete] : []
    }
    
    private func cellSelected(cell: UITableViewCell, indexPath: IndexPath) {
        switch currentView {
        case .list:
            guard let item = selectedGroup?.items?[indexPath.row] else { return }
            if cell.accessoryType == .none {
                selectedItems.append(item)
                cell.accessoryType = .checkmark
            } else {
                let index = selectedItems.index(of: item) ?? 0
                selectedItems.remove(at: index)
                cell.accessoryType = .none
            }
        default:
            break
        }
        
        if currentView == .list {
            let showCheckout = selectedItems.count > 0
            addNewItemContainer.alpha = showCheckout ? 0 : 1
            checkoutContainer.alpha = showCheckout ? 1 : 0
        }
    }
    
}
