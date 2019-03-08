//
//  MainViewController.swift
//  Shopping List
//
//  Created by Jason Modisett on 2/14/19.
//  Copyright © 2019 Jason Modisett. All rights reserved.
//

import UIKit
import Auth0
import PusherSwift
import PushNotifications

class MainViewController: UIViewController, StoryboardInstantiatable, PopoverViewDelegate {
    var pusher: PushNotifications!
    
    static let storyboardName: StoryboardName = "MainViewController"
    @IBOutlet weak var groupName: UILabel!
    @IBOutlet weak var tableView: UITableView!
    
    enum GroupView { case list, history, stats }
    
    var currentView: GroupView = .list { didSet { updateTableView() }}
    
    // MARK: - Lifecycle methods
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.rowHeight = 80
        tableView.tableFooterView = UIView()
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "ReuseIdentifier")
        
        GroupController.shared.getUserID { (user) in
            
            guard let userID = user?.profile.id else { return }
            guard let pusher = self.pusher else {return}
            
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
        guard let selectedGroup = selectedGroup else { return }
        groupName.text = selectedGroup.name
        ItemController.shared.loadItems { (_) in
            UI { self.tableView.reloadData() }
        }
    }
    
    func updateTableView() {
        switch currentView {
        case .list:
            tableView.rowHeight = 80
            
            DispatchQueue.main.async {
                self.tableView.reloadData()
            }
        case .history:
            HistoryController().getHistory { (success) in
                
                if success {
                    DispatchQueue.main.async {
                        self.tableView.reloadData()
                    }
                }
            }
            
            tableView.rowHeight = 200
            
        case .stats:
            GroupMemberController().getGroupMembers { (success) in
                if success {
                    DispatchQueue.main.async {
                        self.tableView.reloadData()
                    }
                } else {
                    // TODO: Show error getting stats
                }
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
        guard let selectedGroup = selectedGroup else { return cell }
        
        var item: Item?
        
        switch currentView {
        case .list:
            item = selectedGroup.items?[indexPath.row]
        case .history:
            item = history[indexPath.row]
        case .stats:
            let groupMember = groupMembers[indexPath.row]
            cell.textLabel?.text = String(groupMember.net)
        }
        
        guard item != nil else { return cell }
        cell.textLabel?.text = item!.name
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
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
            ItemController.shared.deleteItem(id: item.id!) {(_) in
           
        }
            
         completion(true)
        }
        action.backgroundColor = .red
        action.title = "Delete"
        
        return action
    }
    
    

}
