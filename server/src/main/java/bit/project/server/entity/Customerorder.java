package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import java.time.LocalDate;
import javax.persistence.Id;
import java.math.BigDecimal;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Customerorder{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDate doordered;

    private LocalDate dorequired;

    private LocalDate dofinished;

    private LocalDate dohandovered;

    private BigDecimal discount;

    private BigDecimal deliverycost;

    private BigDecimal total;

    private BigDecimal balance;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Customer customer;

    @ManyToOne
    private Customerorderstatus customerorderstatus;

    @OneToMany(mappedBy="customerorder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Customerorderproduct> customerorderproductList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "customerorder")
    private List<Customerpayment> customerorderCustomerpaymentList;

    @JsonIgnore
    @OneToMany(mappedBy = "customerorder")
    private List<Customerrefund> customerorderCustomerrefundList;

    @JsonIgnore
    @OneToMany(mappedBy = "customerorder")
    private List<Customorderitem> customerorderCustomorderitemList;

    @JsonIgnore
    @OneToMany(mappedBy = "customerorder")
    private List<Delivery> customerorderDeliveryList;


    public Customerorder(Integer id){
        this.id = id;
    }

    public Customerorder(Integer id, String code, Customer customer, LocalDate doordered){
        this.id = id;
        this.code = code;
        this.customer = customer;
        this.doordered = doordered;
    }

}