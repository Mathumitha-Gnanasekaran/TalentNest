package com.linhtch90.psnbackend.controller;

import java.security.Principal;
import java.util.Optional;

import com.linhtch90.psnbackend.entity.*;
import com.linhtch90.psnbackend.repository.UserRepository;
import com.linhtch90.psnbackend.service.JWTUtil;
import com.linhtch90.psnbackend.service.ResponseObjectService;
import com.linhtch90.psnbackend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepo;

    @PostMapping("/users")
    public ResponseEntity<ResponseObjectService> findAllUsers() {
        return new ResponseEntity<ResponseObjectService>(userService.findAll(), HttpStatus.OK);
    }

    @PostMapping("/users/profile")
    public ResponseEntity<ResponseObjectService> findById(@RequestBody IdObjectEntity inputId) {
        return new ResponseEntity<ResponseObjectService>(userService.findById(inputId.getId()), HttpStatus.OK);
    }

    @PostMapping("/users/follow")
    public ResponseEntity<ResponseObjectService> followUser(@RequestBody DoubleIdObjectEntity doubleId) {
        return new ResponseEntity<ResponseObjectService>(userService.followUser(doubleId), HttpStatus.OK);
    }

    @PostMapping("/users/unfollow")
    public ResponseEntity<ResponseObjectService> unfollowUser(@RequestBody DoubleIdObjectEntity doubleId) {
        return new ResponseEntity<ResponseObjectService>(userService.unfollowUser(doubleId), HttpStatus.OK);
    }


    @PostMapping("/users/getfollowing")
    public ResponseEntity<ResponseObjectService> findFollowing(@RequestBody IdObjectEntity inputId) {
        return new ResponseEntity<ResponseObjectService>(userService.findFollowing(inputId.getId()), HttpStatus.OK);
    }

    @PostMapping("/users/getfollower")
    public ResponseEntity<ResponseObjectService> findFollower(@RequestBody IdObjectEntity inputId) {
        return new ResponseEntity<ResponseObjectService>(userService.findFollower(inputId.getId()), HttpStatus.OK);
    }

    @DeleteMapping("/users/unfollow")
    public ResponseEntity<ResponseObjectService> unfollowUserss(@RequestBody DoubleIdObjectEntity doubleId) {
        return new ResponseEntity<ResponseObjectService>(userService.unfollowUser(doubleId), HttpStatus.OK);
    }
    @PutMapping("/users/update")
    public ResponseEntity<ResponseObjectService> saveUsers(@RequestBody UserEntity inputUser) {
        String message = "Hello, world!";
        System.out.println(message);
        return new ResponseEntity<ResponseObjectService>(userService.update(inputUser), HttpStatus.OK);
    }
   @PostMapping("/users/save")
   public ResponseEntity<ResponseObjectService> saveUser(@RequestBody UserEntity inputUser) {
      String message = "Hello, world!";      System.out.println(message);
       return new ResponseEntity<ResponseObjectService>(userService.saveUser(inputUser), HttpStatus.OK);
   }
    @DeleteMapping("/users/delete")
    public ResponseEntity<String> deletePost(@RequestBody UserEntity inputUserd) {
        userService.deleteUserById(String.valueOf(inputUserd.getId()));
        return ResponseEntity.ok("User with id " + inputUserd.getId() + " has been deleted");

//        return new ResponseEntity<ResponseObjectService>(userService.deleteUser( inputUser.getId()), HttpStatus.OK);
    }
    @PostMapping("/users/signin")
    public ResponseEntity<ResponseObjectService> userSignIn(@RequestBody UserSignInEntity inputUser) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(inputUser.getEmail(), inputUser.getPassword()));
            String token = jwtUtil.generateToken(inputUser.getEmail());
            
            Optional<UserEntity> optUser = userRepo.findByEmail(inputUser.getEmail());
            UserEntity user = optUser.get();
            user.setPassword("");
            return new ResponseEntity<ResponseObjectService>(new ResponseObjectService("success", "authenticated", new AuthorizedEntity(user, token)), HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<ResponseObjectService>(new ResponseObjectService("fail", "unauthenticated", null), HttpStatus.OK);
        }
    }

//    @PutMapping("/users/update")
//    public ResponseEntity<ResponseObjectService> update(@RequestBody UserEntity inputUser) {
//        return new ResponseEntity<ResponseObjectService>(userService.update(inputUser), HttpStatus.OK);
//    }

    @GetMapping("/getdata")
    public ResponseEntity<String> testAfterLogin(Principal p) {
        return ResponseEntity.ok("Welcome. You are: " + p.getName());
    }
}
