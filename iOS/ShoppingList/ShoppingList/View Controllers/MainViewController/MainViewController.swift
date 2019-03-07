//
//  MainViewController.swift
//  Shopping List
//
//  Created by Jason Modisett on 2/14/19.
//  Copyright © 2019 Jason Modisett. All rights reserved.
//

import UIKit
import Auth0

class MainViewController: UIViewController, StoryboardInstantiatable, PopoverViewDelegate {
    
    static let storyboardName: StoryboardName = "MainViewController"
    @IBOutlet weak var groupName: UILabel!
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var addNewItemContainer: UIView!
    @IBOutlet weak var checkoutContainer: UIView!
    
    enum GroupView { case list, history, stats }
    
    var currentView: GroupView = .list { didSet { updatesNeeded() }}
    
    // MARK: - Lifecycle methods
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.rowHeight = 80
        tableView.tableFooterView = UIView()
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "ReuseIdentifier")
        
        GroupController.shared.getUserID { (user) in
            
            guard let id = user?.profile.id else { return }
            userID = id
            
            GroupController.shared.getGroups(forUserID: id) { (success) in
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
    
    @IBAction func checkoutButtonTapped(_ sender: Any) {
        ItemController().checkout(items: selectedItems, withTotal: 25) { (success) in
            if success {
                print("Checked out")
                UI { self.updatesNeeded() }
            } else {
                fatalError()
            }
        }
    }
    
    
    func updatesNeeded() {
        guard let selectedGroup = selectedGroup else { return }
        selectedItems = []
        addNewItemContainer.alpha = 1
        checkoutContainer.alpha = 0
        groupName.text = selectedGroup.name
        
        switch currentView {
        case .list:
            tableView.rowHeight = 80
            ItemController.shared.loadItems { (_) in
                UI { self.tableView.reloadData() }
            }
        case .history:
            tableView.rowHeight = 200
//            HistoryController().getHistory { (_) in
//                UI { self.tableView.reloadData() }
//            }
             UI { self.tableView.reloadData() }
        case .stats:
            GroupMemberController().getGroupMembers { (_) in
                UI { self.tableView.reloadData() }
            }
        }
    }
    
    
    // MARK: - IBActions
    
    @IBAction func addNewItemButtonPressed(_ sender: Any) {
        Popovers.triggerNewItemPopover(self)
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
            return selectedGroup?.items?.count ?? 0
        case .history:
            return history.count
        case .stats:
            return groupMembers.count
        }
        
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "ReuseIdentifier", for: indexPath)
        cell.tintColor = UIColor(named: "Theme")
        guard let selectedGroup = selectedGroup else { return cell }
        
        var item: Item?
        
        switch currentView {
        case .list:
            guard let item = selectedGroup.items?[indexPath.row] else { return cell }
            cell.accessoryType = selectedItems.contains(item) ? .checkmark : .none
            cell.textLabel?.text = item.name
        case .history:
            item = history[indexPath.row]
            cell.textLabel?.text = item?.name
        case .stats:
            let groupMember = groupMembers[indexPath.row]
            cell.textLabel?.text = String(groupMember.net)
        }
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        guard let cell = tableView.cellForRow(at: indexPath) else { return }
        cellSelected(cell: cell, indexPath: indexPath)
    }
    
    
    private func tableView(tableView: UITableView!, canEditRowAtIndexPath indexPath: NSIndexPath!) -> Bool {
        return true
    }
    
    func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        
        
        let delete = deleteAction(at: indexPath)
        
        return UISwipeActionsConfiguration(actions: [delete]) as UISwipeActionsConfiguration
    }
    
    
    func deleteAction(at indexPath: IndexPath) -> UIContextualAction {
        
        let action = UIContextualAction(style: .destructive, title: "delete") { (action, view, completion) in
            guard let selectedGroup = selectedGroup else { return }
            guard let item = selectedGroup.items?[indexPath.row] else { return }
            ItemController.shared.deleteItem(id: item.id ?? 0) {(_) in }
            if selectedItems.contains(item) {
                let index = selectedItems.index(of: item) ?? 0
                selectedItems.remove(at: index)
            }
            selectedGroup.items?.remove(at: indexPath.row)
            self.tableView.deleteRows(at: [indexPath], with: .automatic)
            completion(true)
        }
        action.backgroundColor = .red
        action.title = "Delete"
        
        return action
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
        
        let showCheckout = selectedItems.count > 0
        addNewItemContainer.alpha = showCheckout ? 0 : 1
        checkoutContainer.alpha = showCheckout ? 1 : 0
    }
    
}
